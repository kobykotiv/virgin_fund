import { describe, it, expect } from 'vitest';
import Advertisement from './index';

describe('Advertisement Component', () => {
    it('renders correctly', () => {
        const ad = new Advertisement();
        expect(ad).toBeTruthy();
    });
});