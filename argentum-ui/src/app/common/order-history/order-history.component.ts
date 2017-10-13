import { Component, Input, OnInit } from '@angular/core';
import { RestService } from '../rest-service/rest.service';
import { Guest } from '../model/guest';
import { Order } from '../model/order';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  @Input()
  allowCancel: boolean;
  @Input()
  message: MessageComponent;

  orders: Order[] = [];

  constructor(private restService: RestService) { }

  ngOnInit() {
  }

  getOrderHistory(guest: Guest) {
    this.restService.getOrders(guest)
      .then((orders: Order[]) => { this.orders = orders; console.log(orders.length); })
      .catch(reason => this.message.error(reason));
  }

}
