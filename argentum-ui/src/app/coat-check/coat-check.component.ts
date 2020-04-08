import {Component, OnInit, ViewChild} from '@angular/core';
import {OrderPanelsComponent} from '../common/order/order-panels/order-panels.component';
import {TagRegistrationService} from '../common/rest-service/tag-registration.service';
import {TagService} from '../common/rest-service/tag.service';
import {Tag} from '../common/model/tag';
import {MessageComponent} from '../common/message/message.component';
import {getPaddingItemCount, getPaginated} from '../common/utils';
import {CardModalComponent} from '../common/card-modal/card-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Order} from '../common/model/order';
import {combineLatest, Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {TagRegistration} from '../common/model/tag-registration';

@Component({
  selector: 'app-coat-check',
  templateUrl: './coat-check.component.html',
  styleUrls: ['./coat-check.component.scss']
})
export class CoatCheckComponent implements OnInit {
  getPaginated = getPaginated;
  getPaddingItemCount = getPaddingItemCount;
  abs = Math.abs;

  readonly MAX_LABEL = 999;

  @ViewChild(OrderPanelsComponent, { static: true })
  orderComponent: OrderPanelsComponent;

  message: MessageComponent;

  availableLabelsPerPage: number;
  stagedLabelsPerPage: number;
  pagesShown: number;
  availablePage = 0;
  stagedPage = 0;

  availableLabels = [];
  stagedLabels = [];
  showRegistered = false;
  registerMode = true;

  constructor(
    private tagService: TagService,
    private tagRegistrationService: TagRegistrationService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.onResize(window);
    this.message = this.orderComponent.message;
    this.orderComponent.commitOrders = false;
    this.orderComponent.canPlace = CoatCheckComponent.prototype.canPlace.bind(this);
    this.orderComponent.orderCreationCallback = CoatCheckComponent.prototype.onOrderCreation.bind(this);
    // We're using our own resize settings here.
    this.orderComponent.onResize = () => {
    };
    this.refresh();
  }

  onResize(newWindow: Window): void {
    if (newWindow.innerWidth < 576) {
      this.availableLabelsPerPage = 4;
      this.stagedLabelsPerPage = 2;
      this.pagesShown = 5;
      this.orderComponent.rangeProductsPerPage = 3;
      this.orderComponent.orderProductsPerPage = 2;
      this.orderComponent.pagesShown = 5;
    } else if (newWindow.innerWidth < 768) {
      this.availableLabelsPerPage = 8;
      this.stagedLabelsPerPage = 4;
      this.pagesShown = 10;
      this.orderComponent.rangeProductsPerPage = 3;
      this.orderComponent.orderProductsPerPage = 4;
      this.orderComponent.pagesShown = 10;
    } else {
      this.availableLabelsPerPage = 12;
      this.stagedLabelsPerPage = 6;
      this.pagesShown = 10;
      this.orderComponent.rangeProductsPerPage = 11;
      this.orderComponent.orderProductsPerPage = 6;
      this.orderComponent.pagesShown = 10;
    }
  }

  clear(): void {
    this.stagedLabels = [];
    this.registerMode = true;
  }

  refresh(): void {
    this.clear();
    this.tagService.list().subscribe((tags: Tag[]) => {
        const labelsAvailable = Array.from(Array(this.MAX_LABEL + 1).keys());
        // Sort registered labels in descending order-panels and slice from available labels to preserve indices.
        const labelsRegistered = tags.map((tag: Tag) => tag.label).sort((a: number, b: number) => b - a);
        // At this point availableLabels[i] === i, so labels are easy to mark by their index.
        for (const labelRegistered of labelsRegistered) {
          labelsAvailable[labelRegistered] = -labelRegistered;
        }
        // Remove 0.
        labelsAvailable.shift();
        if (!this.showRegistered) {
          this.availableLabels = labelsAvailable.filter((label: number) => label > 0);
        } else {
          // Registered labels are marked by being negative.
          this.availableLabels = labelsAvailable;
        }
      },
      (error: string) => this.message.error(error)
    );
  }

  toggleRegisteredLabels() {
    this.showRegistered = !this.showRegistered;
    this.refresh();
  }

  availableLabelClicked(label: number) {
    this.stagedLabels.push(label);
  }

  stagedLabelClicked(label: number) {
    const index = this.stagedLabels.indexOf(label);
    this.stagedLabels.splice(index, 1);
  }

  availableLabelDisabled(label: number): boolean {
    return !this.registerMode || this.stagedLabels.includes(label);
  }

  stagedLabelDisabled(label: number): boolean {
    return !this.registerMode;
  }

  canPlace(): boolean {
    return this.registerMode && this.stagedLabels.length > 0;
  }

  onOrderCreation(card: string, order: Order): void {
    // Already registered labels are still negative when staged.
    const stagedLabelsAbs = this.stagedLabels.map((label: number) => Math.abs(label));
    this.tagRegistrationService.create(card, stagedLabelsAbs, order).subscribe(
      (tagRegistration: TagRegistration) => {
        const labels = tagRegistration.labels;
        this.message.success(`Tag${labels.length > 1 ? 's' : ''} <b>${labels.join(',')}</b> registered for <b>card #${card}</b>`);
        this.refresh();
      },
      (error: string) => this.message.error(error)
    );
  }

  loadTags(): void {
    this.registerMode = true;
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (card: string) => {
        this.tagService.listByCard(card).subscribe(
          (tags: Tag[]) => {
            this.registerMode = false;
            // Negate tag labels, so they are styled as registered.
            this.stagedLabels = tags.map((tag: Tag) => -tag.label);
          },
          (error: string) => {
            this.message.error(error);
            this.clear();
          }
        );
      },
      (cancel: string) => this.clear()
    );
  }
}
