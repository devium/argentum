import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {QuantitySales, Statistics, StatTransaction} from '../../common/model/statistics';
import {MessageComponent} from '../../common/message/message.component';
import {Product} from '../../common/model/product';
import {Chart} from 'chart.js';
import palette from 'google-palette';
import {StatisticsService} from '../../common/rest-service/statistics.service';
import {formatCurrency} from '../../common/utils';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistics: Statistics;
  products: Map<number, Product> = new Map<number, Product>();

  @ViewChild(MessageComponent, { static: true })
  message: MessageComponent;

  @ViewChild('salesCanvas', { static: true })
  salesCanvas: ElementRef;
  salesChart: Chart;
  salesLabels: string[];
  salesQuantities: number[];
  salesQuantitiesTotal: number;
  salesValues: number[];
  salesValuesTotal: number;

  @ViewChild('checkInsCanvas', { static: true })
  checkInsCanvas: ElementRef;
  checkInsChart: Chart;

  @ViewChild('transactionsCanvas', { static: true })
  transactionsCanvas: ElementRef;
  transactionsChart: Chart;

  constructor(private statisticsService: StatisticsService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    this.statisticsService.list().subscribe(
      (statistics: Statistics) => {
        this.statistics = statistics;
        this.redrawCharts();
      },
      (error: any) => this.message.error(error)
    );
  }

  redrawCharts() {
    this.redrawSales();
    this.redrawCheckIns();
    this.redrawTransactions();
  }

  redrawSales() {
    const salesContext = this.salesCanvas.nativeElement.getContext('2d');

    const quantitySalesSorted = this.statistics.quantitySales.sort((qs1: QuantitySales, qs2: QuantitySales) => qs1.quantity - qs2.quantity);
    this.salesQuantities = quantitySalesSorted.map((qs: QuantitySales) => qs.quantity);
    this.salesQuantitiesTotal = this.salesQuantities.reduce((a: number, b: number) => a + b, 0);

    this.salesValues = quantitySalesSorted.map((qs: QuantitySales) => qs.value);
    this.salesValuesTotal = this.salesValues.reduce((a: number, b: number) => a + b, 0);

    this.salesLabels = quantitySalesSorted.map((qs: QuantitySales) => qs.product.name);
    const colorPalette = palette('qualitative', quantitySalesSorted.length).map((hex: string) => '#' + hex);

    this.salesChart = new Chart(salesContext, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.salesQuantities,
            backgroundColor: colorPalette
          },
          {
            data: this.salesValues,
            backgroundColor: colorPalette
          }
        ]
      },
      options: {
        title: {
          text: 'Product sales by quantity (outer ring) and value (inner ring)',
          display: true
        },
        tooltips: {
          callbacks: {
            label: tooltipModel => {
              if (tooltipModel.datasetIndex === 0) {
                const label = this.salesLabels[tooltipModel.index];
                const value = this.salesQuantities[tooltipModel.index];
                const percentage = value / this.salesQuantitiesTotal;
                return `${label}: ${value} (${formatCurrency(percentage * 100)}%)`;
              } else {
                const label = this.salesLabels[tooltipModel.index];
                const value = this.salesValues[tooltipModel.index];
                const percentage = value / this.salesValuesTotal;
                return `${label}: €${formatCurrency(value)} (${formatCurrency(percentage * 100)}%)`;
              }
            }
          }
        }
      }
    });
  }

  redrawCheckIns() {
    const checkInsContext = this.checkInsCanvas.nativeElement.getContext('2d');
    const points = [];
    for (const time of this.statistics.checkIns) {
      points.push({x: time, y: points.length + 1});
    }

    this.checkInsChart = new Chart(checkInsContext, {
      type: 'line',
      data: {
        datasets: [
          {
            data: points,
            borderColor: 'rgba(0, 123, 255, 1)',
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            steppedLine: true
          }
        ]
      },
      options: {
        title: {
          text: 'Check-ins',
          display: true
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              tooltipFormat: 'YYYY-MM-DD HH:mm',
              displayFormats: {
                millisecond: 'HH:mm:ss.SSS',
                second: 'HH:mm:ss',
                minute: 'HH:mm',
                hour: 'HH:00'
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Number of guests'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  redrawTransactions(): void {
    const transactionsContext = this.transactionsCanvas.nativeElement.getContext('2d');
    const depositPoints = this.statistics.deposits.map((tx: StatTransaction) => Object.assign({x: tx.time, y: tx.value}));
    const withdrawalPoints = this.statistics.withdrawals.map((tx: StatTransaction) => Object.assign({x: tx.time, y: -tx.value}));
    const orderPoints = this.statistics.orders.map((tx: StatTransaction) => Object.assign({x: tx.time, y: -tx.value}));
    const cumSum = (pointArray: Array<{x: Date, y: number}>) => {
      for (let i = 1; i < pointArray.length; ++i) {
        pointArray[i].y = pointArray[i].y + pointArray[i - 1].y;
      }
    };

    cumSum(depositPoints);
    cumSum(withdrawalPoints);
    cumSum(orderPoints);

    // Let them all start at 0 at the same time and end at their current value..
    const firstTimes = [];
    const lastTimes = [];
    for (const points of [depositPoints, withdrawalPoints, orderPoints]) {
      if (points.length > 0) {
        firstTimes.push(points[0].x);
        lastTimes.push(points[points.length - 1].x);
      }
    }
    const firstTime = Math.min(...firstTimes);
    const lastTime = Math.max(...lastTimes);
    if (firstTimes.length > 0) {
      for (const points of [depositPoints, withdrawalPoints, orderPoints]) {
        points.unshift({x: new Date(firstTime), y: 0});
      }
      for (const points of [depositPoints, withdrawalPoints, orderPoints]) {
        if (points.length > 0) {
          // Avoid duplicate points at the end.
          if (points[points.length - 1].x.getTime() !== lastTime) {
            points.push({x: new Date(lastTime), y: points[points.length - 1].y});
          }
        } else {
          points.push({x: new Date(lastTime), y: 0});
        }
      }
    }

    this.transactionsChart = new Chart(transactionsContext, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Deposits',
            data: depositPoints,
            borderColor: 'rgba(40, 167, 69, 1)',
            fill: false,
            steppedLine: true
          },
          {
            label: 'Withdrawals',
            data: withdrawalPoints,
            borderColor: 'rgba(220, 53, 69, 1)',
            fill: false,
            steppedLine: true
          },
          {
            label: 'Orders',
            data: orderPoints,
            borderColor: 'rgba(0, 123, 255, 1)',
            fill: false,
            steppedLine: true
          }
        ]
      },
      options: {
        title: {
          text: 'Transactions',
          display: true
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              tooltipFormat: 'YYYY-MM-DD HH:mm',
              displayFormats: {
                millisecond: 'HH:mm:ss.SSS',
                second: 'HH:mm:ss',
                minute: 'HH:mm',
                hour: 'HH:00'
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Cumulative transactions'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  downloadSales(): void {
    const rows = Array(this.salesLabels.length).fill(0).map((_, i) => {
      return [
        this.salesLabels[i],
        this.salesQuantities[i],
        this.salesQuantities[i] / this.salesQuantitiesTotal,
        this.salesValues[i],
        this.salesValues[i] / this.salesValuesTotal
      ].join(',');
    });
    rows.unshift(['Product', 'Quantity', 'Quantity %', 'Value', 'Value %'].join(','));
    const blob = new Blob([rows.join('\n')], {type: 'text/csv'});
    saveAs(blob, 'sales.csv');
  }

}
