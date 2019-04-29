import { CarInfo } from './car-info';

describe('CarInfo', () => {
  it('should create an instance', () => {
    expect(new CarInfo(1, 'AA-BB-11', 'Pietje Bell', 'abcd')).toBeTruthy();
  });
});
