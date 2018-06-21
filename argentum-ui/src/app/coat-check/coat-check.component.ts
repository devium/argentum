import { Component, OnInit, ViewChild } from '@angular/core';
import { CardBarComponent } from '../common/card-bar/card-bar.component';
import { MessageComponent } from '../common/message/message.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../common/rest-service/rest.service';
import { Product } from '../common/model/product';
import { CoatCheckTag } from '../common/model/coat-check-tag';
import { Guest } from '../common/model/guest';
import { CoatCheckTagResponse, toCoatCheckTag } from '../common/rest-service/response/coat-check-tag-response';

class EditorTag extends CoatCheckTag {
  flaggedForRemoval = false;

  constructor(base: CoatCheckTag) {
    super();
    this.id = base.id;
    this.time = base.time;
    this.guest = base.guest;
    this.flaggedForRemoval = false;
  }
}

@Component({
  selector: 'app-coat-check',
  templateUrl: './coat-check.component.html',
  styleUrls: ['./coat-check.component.scss']
})
export class CoatCheckComponent implements OnInit {
  // TODO: change to 999
  readonly MAX_ID = 111;

  free_page_size: number;
  max_free_pages_shown: number;
  stored_page_size: number;
  max_stored_pages_shown: number;
  prices: number[];

  freeIds: number[] = [];
  freePage = 1;
  storedTags: EditorTag[] = [];
  storedPage = 1;

  activeGuest: Guest = null;
  activePrice = 0.00;

  waitingForSave = false;

  @ViewChild(MessageComponent)
  message: MessageComponent;
  @ViewChild(CardBarComponent)
  cardBar: CardBarComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.onResize(window);
    this.refreshTags();
    this.cardBar.countdownStream.subscribe(() => this.setActiveGuest(this.cardBar.guest));
  }

  onResize(newWindow: Window): void {
    if (newWindow.innerWidth < 576) {
      this.free_page_size = 6;
      this.max_free_pages_shown = 3;
      this.stored_page_size = 4;
      this.max_stored_pages_shown = 3;
      this.prices = [0.00, 0.50, 1.00, 2.00, 3.00];
    } else if (newWindow.innerWidth < 768) {
      this.free_page_size = 8;
      this.max_free_pages_shown = 5;
      this.stored_page_size = 4;
      this.max_stored_pages_shown = 5;
      this.prices = [0.00, 0.50, 1.00, 2.00, 3.00, 5.00];
    } else {
      this.free_page_size = 12;
      this.max_free_pages_shown = 5;
      this.stored_page_size = 6;
      this.max_stored_pages_shown = 2;
      this.prices = [0.00, 0.50, 1.00, 2.00, 3.00, 5.00];
    }
  }

  getPaginated(data: any[], pageSize: number, page: number): Product[] {
    return data.slice(pageSize * (page - 1), pageSize * page);
  }

  getNumPadItems(count: number, pageSize: number, page: number): number {
    if (count === 0) {
      return pageSize;
    }
    if (count - pageSize * (page - 1) < pageSize) {
      return pageSize - count % pageSize;
    }
    return 0;
  }

  refreshTags() {
    this.restService.getAllCoatCheckTags()
      .then((tagIds: number[]) => {
        // Integer range from 1 to this.MAX_ID.
        this.freeIds = Array.from({ length: this.MAX_ID }, (v, k) => k + 1);
        this.freeIds = this.freeIds.filter((id: number) => !tagIds.includes(id));

        // Remove tags in the right panel from the available tags.
        const storedTagIds = this.storedTags.map((tag: EditorTag) => tag.id);
        this.freeIds = this.freeIds.filter((id: number) => !storedTagIds.includes(id));
      })
      .catch(reason => this.message.error(reason));
  }

  setActiveGuest(guest: Guest) {
    if (
      (!guest && this.activeGuest) ||
      (guest && !this.activeGuest) ||
      (guest && this.activeGuest && guest.id !== this.activeGuest.id)
    ) {
      this.activeGuest = guest;
      this.loadGuest(guest);
    }
    if (guest === null) {
      this.cardBar.reset();
    }
  }

  loadGuest(guest: Guest) {
    // Remove all saved tags from the store tags grid.
    this.storedTags = this.storedTags.filter((tag: EditorTag) => !tag.time);

    if (guest === null) {
      return;
    }

    this.waitingForSave = true;
    this.restService.getGuestCoatCheckTags(guest)
      .then((tags: CoatCheckTag[]) => {
        this.storedTags.push(...tags.map((tag: CoatCheckTag) => new EditorTag(tag)));
        this.waitingForSave = false;
      })
      .catch(reason => {
        this.message.error(reason);
        this.waitingForSave = false;
      });
  }

  addTag(tagId: number) {
    this.storedTags.push({
      id: tagId,
      time: null,
      guest: null,
      flaggedForRemoval: false
    });

    const index = this.freeIds.indexOf(tagId);
    if (index !== -1) {
      this.freeIds.splice(index, 1);
    }
  }

  removeTag(tag: EditorTag) {
    if (tag.time === null) {
      // Not saved yet.
      const index = this.storedTags.indexOf(tag);
      if (index !== -1) {
        this.storedTags.splice(index, 1);
      }
      this.freeIds.push(tag.id);
      this.freeIds.sort((a, b) => a - b);
    } else {
      tag.flaggedForRemoval = !tag.flaggedForRemoval;
    }
  }

  removeAllTags() {
    const removedTagIds: number[] = [];
    for (let i = this.storedTags.length - 1; i >= 0; --i) {
      const tag = this.storedTags[i];
      if (tag.time === null) {
        // Not saved yet.
        removedTagIds.push(tag.id);
        this.storedTags.splice(i, 1);
      } else {
        tag.flaggedForRemoval = true;
      }
    }
    this.freeIds.push(...removedTagIds);
    this.freeIds.sort((a, b) => a - b);
  }

  canRemoveAll(): boolean {
    // Deleting all is possible as long as there is still one tag that is not flagged for deletion.
    // Note: unsaved tags are never flagged for deletion.
    return this.storedTags.find((tag: EditorTag) => !tag.flaggedForRemoval) !== undefined;
  }

  unflagAllTags() {
    for (const tag of this.storedTags) {
      tag.flaggedForRemoval = false;
    }
  }

  canUnflagAll(): boolean {
    // Only if at least one saved tag is flagged for removal.
    return this.storedTags.find((tag: EditorTag) => tag.flaggedForRemoval) !== undefined;
  }

  canSave(): boolean {
    return (
      // Can't save if a save is already in progress.
      !this.waitingForSave &&
      this.storedTags.length > 0 && (
        // Either a new tag is to be saved or a saved tag is flagged for deletion.
        this.storedTags.find((tag: EditorTag) => tag.time === null) !== undefined ||
        this.storedTags.find((tag: EditorTag) => tag.flaggedForRemoval) !== undefined
      ) && (
        // Either the scanned guest is still logged in the card bar or the tagging changes are free.
        this.cardBar.guest !== null || (
          // Tags may still be saved without an active card bar if it doesn't cost the guest anything.
          this.activeGuest !== null && this.activePrice === 0
        )
      )
    );
  }

  saveTags() {
    this.waitingForSave = true;
    this.cardBar.active = false;

    const deleteTagIds = this.storedTags
      .filter((tag: EditorTag) => tag.flaggedForRemoval)
      .map((tag: EditorTag) => tag.id);

    const newTagIds = this.storedTags
      .filter((tag: EditorTag) => tag.time === null)
      .map((tag: EditorTag) => tag.id);

    const guest = this.activeGuest;
    const price = this.activePrice;

    // Deregister first.
    let pDelete: Promise<void> = Promise.resolve();
    if (deleteTagIds.length > 0) {
      pDelete = this.restService.deregisterTags(deleteTagIds);
    }

    // Register new tags.
    let pRegister: Promise<CoatCheckTagResponse[]> = Promise.resolve([]);
    if (newTagIds.length > 0) {
      pRegister = this.restService.registerTags(newTagIds, guest, price);
    }

    Promise.all([pDelete, pRegister])
      .then(([{}, response]: [void, CoatCheckTagResponse[]]) => {
        let message = '';
        if (deleteTagIds.length > 0) {
          message += `Deregistered the following tags: <b>${deleteTagIds}</b>.<br>`;
        }
        if (newTagIds.length > 0) {
          message += `Registered the following tags: <b>${newTagIds}</b>.<br>`;
        }
        message += `
          For <b>${guest.name}</b>.<br>
          Price: <b>€${price.toFixed(2)}.</b>
        `;
        this.message.success(message);

        // Update saved tags to reflect their saved state.
        this.storedTags = this.storedTags.filter((tag: EditorTag) => tag.time !== null);
        for (const tagResponse of response) {
          this.storedTags.push(new EditorTag(toCoatCheckTag(tagResponse)));
        }

        // Update tag views to remove deleted tags and make them available again.
        this.storedTags = this.storedTags.filter((tag: EditorTag) => !deleteTagIds.includes(tag.id));
        this.freeIds.push(...deleteTagIds);
        this.freeIds.sort((a, b) => a - b);

        this.waitingForSave = false;
        this.cardBar.active = true;
        this.cardBar.reset();
      })
      .catch(reason => {
        this.message.error(reason);
        this.waitingForSave = false;
        this.cardBar.active = true;
      });
  }

  formatTime(time: Date): string {
    return `${time.getHours()}:${time.getMinutes()}`;
  }

}
