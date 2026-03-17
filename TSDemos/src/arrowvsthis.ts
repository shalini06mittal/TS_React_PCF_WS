class Timer {
  seconds: number = 0;

  // Regular function — "this" is undefined in strict mode
  startBroken() {
    setInterval(function () {
     // console.log(this);
      
   //   this.seconds++;  // ERROR: "this" is not Timer here
    }, 1000);
  }

  // ✅ Arrow function — "this" is captured from Timer
  startFixed() {
    console.log(this);
    
    setInterval(() => {
      console.log(this);
      
      this.seconds++;  // ✅ Correct — "this" is Timer
    }, 1000);
  }
}

let timer1 = new Timer();

// timer1.startBroken()


timer1.startFixed();