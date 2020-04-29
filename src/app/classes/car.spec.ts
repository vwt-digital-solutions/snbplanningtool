import { Car } from './car';

describe('Car', () => {
  it('should create an instance', () => {
    expect(new Car(1, 'AA-BB-11', 'Pietje Bell', 'Metende', '101', 'Service', '901058', 'Administratie niet kunnen bepalen', '9050')).toBeTruthy();
  });
});
