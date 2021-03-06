ModuleSpec = JS.Test.describe("Module", function() { with(this) {
  before(function() { with(this) {
    this.object = new Module()
    stub("jQuery", {})
  }})
  
  it("says hello", function() { with(this) {
    assertEqual({hello: "world"}, object.say())
    assertNotEqual({say: "hi"}, object.say())
  }})
  
  it("fetches a resource", function(resume) { with(this) {
    expect(jQuery, "get").yields(["OK"])
    
    object.fetch("/foo", function(response) {
      resume(function() {
        assertEqual("OK", response)
      })
    })
  }})
  
  it("yields different responses for different paths", function(resume) { with(this) {
    stub(jQuery, "get").given("/foo").yields(["hello"])
    stub(jQuery, "get").given("/bar").yields(["bye"])
    
    object.fetch("/bar", function(response) {
      resume(function() {
        assertEqual("bye", response)
      })
    })
  }})
  
  it("stubs a callback with context", function(resume) { with(this) {
    stub(object, "fetch").yields(["hello"])
    var context = {}
    object.fetch("/something", function(response) {
      this.response = response
      resume(function() {
        assertEqual("hello", context.response)
      })
    }, context)
  }})
  
  describe("aynsc errors", function() { with(this) {
    if (!JS.ENV.setTimeout) return
    
    before(function() { with(this) {
      this.asyncFunction = function(callback) {
        setTimeout(function() {
          throw new Error("async error")
          callback(true)
        }, 10)
      }
    }})
    
    it("cathces them", function(resume) { with(this) {
      asyncFunction(function(value) {
        resume(function() { assert(value) })
      })
    }})
  }})
}})

