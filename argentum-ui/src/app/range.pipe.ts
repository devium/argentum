import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'range' })
export class RangePipe implements PipeTransform {
  transform(minValue: number, maxValue: number): number[] {
    let range = [];
    for (let index = minValue; index <= maxValue; index++) {
      range.push(index);
    }
    return range;
  }
}
