import {Component, OnInit, ViewChild} from '@angular/core';
import {Guest} from '../../common/model/guest';
import {Editor} from '../../common/model/editor';
import {GuestService} from '../../common/rest-service/guest.service';
import {combineLatest, Observable, of} from 'rxjs';
import {Transaction} from '../../common/model/transaction';
import {BonusTransaction} from '../../common/model/bonus_transaction';
import {BonusTransactionService} from '../../common/rest-service/bonus-transaction.service';
import {TransactionService} from '../../common/rest-service/transaction.service';
import {flatMap} from 'rxjs/operators';
import {MessageComponent} from '../../common/message/message.component';
import {EditorComponent} from '../editor/editor.component';
import {convertCard} from '../../common/utils';
import {StatusService} from '../../common/rest-service/status.service';
import {Statuses} from '../../common/rest-service/test-data/statuses';
import {Status} from '../../common/model/status';


@Component({
  selector: 'app-guest-editor',
  templateUrl: './guest-editor.component.html',
  styleUrls: ['./guest-editor.component.scss']
})
export class GuestEditorComponent implements OnInit {
  @ViewChild(EditorComponent)
  editor: EditorComponent;
  message: MessageComponent;

  editorConfig: Editor.Config<Guest>;

  constructor(
    private statusService: StatusService,
    private guestService: GuestService,
    private transactionService: TransactionService,
    private bonusTransactionService: BonusTransactionService
  ) {
  }

  ngOnInit() {
    this.message = this.editor.message;
    const statuses$ = this.statusService.list().subscribe(
      (statuses: Status[]) => {
        const statusOptions = statuses.map((status: Status) => new Editor.OptionSpec(status.displayName, status, status.color));
        statusOptions.unshift(new Editor.OptionSpec('No Status', null, '#ffffff'));

        this.editorConfig = new Editor.Config<Guest>(
          this.message,
          (filters: Object) => this.guestService.listFiltered(filters, statuses),
          (original: Guest, active: Guest) => {
            let guest$: Observable<Guest>;
            if (original.id) {
              guest$ = this.guestService.update(active, statuses);
            } else {
              guest$ = this.guestService.create(active, statuses);
            }
            const dBalance = active.balance - original.balance;
            const dBonus = active.bonus - original.bonus;

            if (dBalance === 0 && dBonus === 0) {
              return guest$;
            }

            return guest$.pipe(
              flatMap((guest: Guest) => {
                  // Create and commit transactions, then retrieve the guest again.
                  let balance$: Observable<Transaction>;
                  let bonus$: Observable<BonusTransaction>;

                  if (dBalance !== 0) {
                    balance$ = this.transactionService.create(guest, dBalance, false, []);
                  } else {
                    balance$ = of(null);
                  }
                  if (dBonus !== 0) {
                    bonus$ = this.bonusTransactionService.create(guest, dBonus);
                  } else {
                    bonus$ = of(null);
                  }

                  balance$ = balance$.pipe(
                    flatMap((transaction: Transaction) => {
                      if (transaction) {
                        return this.transactionService.commit(transaction, []);
                      } else {
                        return of(null);
                      }
                    })
                  );
                  bonus$ = bonus$.pipe(
                    flatMap((bonusTransaction: BonusTransaction) => {
                      if (bonusTransaction) {
                        return this.bonusTransactionService.commit(bonusTransaction);
                      } else {
                        return of(null);
                      }
                    })
                  );

                  return combineLatest(balance$, bonus$).pipe(
                    flatMap(([balanceTransaction, bonusTransaction]: [Transaction, BonusTransaction]) => {
                      return this.guestService.retrieve(guest, statuses);
                    })
                  );
                }
              )
            );
          },
          null,
          new Guest(undefined, 'CODE', 'New Guest', 'new@guest.com', null, null, null, 0, 0),
          [
            new Editor.FieldSpec<Guest>('ID', Editor.FieldType.ReadOnlyField, 'id'),
            new Editor.FieldSpec<Guest>('Code', Editor.FieldType.StringField, 'code', {filtered: true, sortable: true, minWidth: 150}),
            new Editor.FieldSpec<Guest>('Name', Editor.FieldType.StringField, 'name', {filtered: true, sortable: true, minWidth: 150}),
            new Editor.FieldSpec<Guest>('Mail', Editor.FieldType.StringField, 'mail', {filtered: true, sortable: true, minWidth: 150}),
            new Editor.FieldSpec<Guest>('Status', Editor.FieldType.DropdownField, 'status',
              {
                filtered: true,
                optionsFilter: true,
                sortable: true,
                minWidth: 90,
                optionSpecs: statusOptions,
                // Covers valid IDs, null status, and the empty filter ''.
                filterMap: (filter: any) => filter instanceof Status ? (<Status>filter).id : filter
              }
            ),
            new Editor.FieldSpec<Guest>('Check-in', Editor.FieldType.DateField, 'checkedIn',
              {sortable: true, filterKey: 'checked_in', minWidth: 180}
            ),
            new Editor.FieldSpec<Guest>('Card', Editor.FieldType.CardField, 'card',
              {filtered: true, filterMap: (card: string) => convertCard(card)}
            ),
            new Editor.FieldSpec<Guest>('Balance', Editor.FieldType.BalanceField, 'balance', {sortable: true}),
            new Editor.FieldSpec<Guest>('Bonus', Editor.FieldType.BalanceField, 'bonus', {sortable: true})
          ]
        );
      },
      (error: string) => this.message.error(error)
    );
  }
}
