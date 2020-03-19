import { Car } from './car';

describe('Car', () => {
  it('should create an instance', () => {
    expect(new Car(1, 'AA-BB-11', 'Pietje Bell', 'Metende', '101', 'Administratie niet kunnen bepalen', 'abcd')).toBeTruthy();
  });
});
