describe('Item details page',function(){

    // Run this once prior to the it() blocks below
    before(function(){
        browser.manage().window().maximize()
        browser.get('http://localhost:8080')
        browser.sleep(500)
    });

    it('should not show the pickup in store button ',function(done){
        expect(element(by.id('pickup-button')).isDisplayed()).to.eventually.eq(false);
        done();
    });

    it('should show the add to cart button ',function(done){
        expect(element(by.id('addcart-button')).isDisplayed()).to.eventually.eq(true);
        done();
    });

    // Add more tests

})
