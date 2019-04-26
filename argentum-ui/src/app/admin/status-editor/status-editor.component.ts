import { Component, OnInit, ViewChild } from '@angular/core';
import { Status } from '../../common/model/status';
import { MessageComponent } from '../../common/message/message.component';

class EditorStatus {
  original: Status;
  edited: Status;
  displayed: Status;
  changed = false;

  constructor(original: Status) {
    if (original) {
      this.original = Object.assign({}, original);
      this.edited = Object.assign({}, original);
      this.displayed = this.edited;
    } else {
      this.original = null;
      this.edited = new Status(undefined, 'new_status', 'New Status', '#ffffff');
      this.displayed = this.edited;
    }
    this.updateChanged();
  }

  hasChangedProperties(): boolean {
    for (const prop in this.original) {
      if (this.original[prop] !== this.edited[prop]) {
        return true;
      }
    }
    return false;
  }

  updateChanged() {
    this.changed = !this.original || this.hasChangedProperties();
  }

  reset() {
    this.edited = Object.assign({}, this.original);
    this.displayed = this.edited;
    this.updateChanged();
  }

  flagForRemoval() {
    this.edited = null;
    this.displayed = this.original;
  }
}

@Component({
  selector: 'app-status-editor',
  templateUrl: './status-editor.component.html',
  styleUrls: ['./status-editor.component.scss']
})
export class StatusEditorComponent implements OnInit {
  statuses: EditorStatus[] = [];

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor() {
  }

  ngOnInit() {
    this.loadStatuses();
  }

  loadStatuses() {
    // TODO
    // this.restService.getStatuses()
    Promise.resolve([])
      .then((statuses: Status[]) => this.statuses = statuses.map(status => new EditorStatus(status)))
      .catch(reason => this.message.error(reason));
  }

  remove(status: EditorStatus) {
    if (status.original) {
      status.flagForRemoval();
    } else {
      this.statuses.splice(this.statuses.indexOf(status), 1);
    }
  }

  newStatus() {
    this.statuses.push(new EditorStatus(null));
  }

  resetAll() {
    this.statuses.forEach(status => {
      if (status.original) {
        status.reset();
      }
    });
    this.statuses = this.statuses.filter(status => status.original);
  }

  save() {
    const updatedStatuses = this.statuses
      .filter(status => status.changed)
      .map(status => status.edited);
    const deletedStatuses = this.statuses
      .filter(status => !status.edited)
      .map(status => status.original);

    // TODO
    const pCreate = Promise.resolve();
    const pDelete = Promise.resolve();

    Promise.all([pCreate, pDelete])
      .then(() => {
        this.message.success(`
          Statuses saved successfully.
          (<b>${updatedStatuses.length}</b> created/updated,
          <b>${deletedStatuses.length}</b> deleted)
        `);
        this.loadStatuses();
      })
      .catch(reason => this.message.error(reason));
  }
}
