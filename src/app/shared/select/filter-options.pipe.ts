import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOptions',
  standalone: true,
  pure: true,
})
export class FilterOptionsPipe implements PipeTransform {
  transform(value: (string | number)[], filter: string): (string | number)[] {
    if (filter) {
      const filterKeys = filter.split(' ');
      return value.filter((item: string | number) => {
        return filterKeys.every((key) => {
          if (typeof item === 'number') {
            return item.toString().includes(key);
          }
          return item.toLowerCase().includes(key.toLowerCase());
        });
      });
    }

    return value;
  }
}
