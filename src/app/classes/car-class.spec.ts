import { CarClass } from './car-class';

describe('CarClass', () => {
  it('should create an instance', () => {
    expect(new CarClass(1, 'AA-BB-11', 'Pietje Bell', 'Metende', 'abcd')).toBeTruthy();
  });
});
