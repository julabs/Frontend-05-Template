var assert = require('assert');

import { add, mul } from '../add';

describe("add function 测试", function(){
    it('1+2 等于 3', function(){
        assert.equal(add(1, 2), 3);
    });
    
    it('-5+2 等于 -3', function(){
        assert.equal(add(-5, 2), -3);
    })

    it('-5*2 等于 -10', function(){
        assert.equal(mul(-5, 2), -10);
    })
});


