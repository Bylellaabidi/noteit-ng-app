import {compute } from './compute'

describe('compute', ()=>{
    it('Should return a zero', ()=>{
        const rslt=compute(-1);
        expect(rslt).toBe(0);
    })
})