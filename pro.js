 var personal = {
          name: "Unsure",          
          netflix: "Unsure",
          searchq: [],
          askname: 0,
          givename: 0,
          youtube: "Unsure"


        }
      var mic = new Wit.Microphone(document.getElementById("microphone"));
      var info = function (msg) {
        document.getElementById("info").innerHTML = msg;
      };
      var error = function (msg) {
        document.getElementById("error").innerHTML = msg;
      };
      mic.onready = function () {
        info("Microphone is ready to record");
      };
      mic.onaudiostart = function () {
        info("Recording started");
        error("");
      };
      mic.onaudioend = function () {
        info("Recording stopped, processing started");
      };
      mic.onresult = function (intent, entities, undoc) {
        console.log("UNDOC BELOW");
        console.log( JSON.stringify(undoc) );
        console.log("entities below");
        console.log( JSON.stringify(entities));
        var arr = [];
        var help = [];
        var r = kv("intent", intent);
                          var leng = Object.keys(undoc.outcome.entities).length;

                          for(var i = 0; i < leng; i++){
                            help.push(JSON.stringify(Object.keys(undoc.outcome.entities)[i]));
                            console.log("Entity Quote: "+JSON.stringify(Object.keys(undoc.outcome.entities)[i]));
                          }


        console.log("The intent is: " + intent);

        for (var k in entities) {
          var e = entities[k]; // Pull items out of entities (2)
          console.log("Value of var e in loop: " + e);
          console.log("Value of e.value before Loop: " + e.value);
          console.log("Entity of E: " + e.entity);

          if (!(e instanceof Array)) {
            console.log("e.value inside of loop: " + e.value);
            console.log("If succeded");
            r += kv(k, e.value);
            arr.push(e.value);
          } else {
            for (var i = 0; i < e.length; i++) {
              console.log("e.value inside of loop: " + e.value);
            console.log("If failed");
              r += kv(k, e[i].value);
            }
          }
        }

        document.getElementById("result").innerHTML = r;
        //alert(help);
        //alert(help[0]);
        BigPipe(intent, arr, help); // Start process here!!

        console.log("Total of R: " + r);
      };

      function response(txt){
        $("#response").html(txt);
        var msg = new SpeechSynthesisUtterance(txt);
        window.speechSynthesis.speak(msg);
      }





      /* WHERE ALL THE RESPONSES WILL BE COMING FROM, TODO: SWITCH TO SERVER SIDE WITH NODEJS */
       function BigPipe(intent, prop, help){ // Greeting, [e.value], [e.value]

                   var a = document.createElement("a");
                   a.target = "_blank";





        switch (intent) {
          case "Greeting":
          var sad = false;
          var request = false;
          var im = false;
          var done = false;
          var cu = false;
          for(var i = 0; i < help.length; i++){
            switch (help[i]) {
              case '"sadness_"':
              sad = true;
              break;
              case '"request"':
              request = true;
              break;
              case '"im"':
              im = true;
              break;
              case '"can"':
              cu = true;
              default:
              break;
            }
            
          }

          if(im === true){
            response("Alright");
            done = true;
          }
          if(cu === true){
            response("I'm not quite sure");
            done = true;
          }
          if(done === false){

          if(sad === false){
            if(request === false){ // They are happy and don't have a request
              response("That's great to hear!");
            }
            else if(request === true){
              response("I'm having a great day, thanks for asking.");  
           
            }
          }

          if(sad === true){
            if(request === false){
              response("Hope it gets better");

            }
            else if(request === true){
              response("I'm doing alright, thanks for asking.");

            }
          }
        }
          break;

          case "Name":
          var n = help[0];
          if(n === '"aName"'){
            if(personal.askname > 0){
              response("You've already asked me that!");
            } else{
              if(personal.name === "Unsure"){
            response("Hi, my name is wit. What's your name?");
            }
            else{
              response("thanks for asking, my name is wit");
            }
            personal.askname = 1;

              }
          }
          else if(n === '"rName"'){
            personal.name = prop[0];
            if(personal.givename > 0){
            response("You've already told me your name " + personal.name);
            } else{
              response("It's good to meet you " + personal.name + "!");
              personal.givename = 1;
            }
          }
          break;
          case "Video":
          var extra = prop[0]; // trailer
          var vid = prop[1]; // video https://www.youtube.com/results?search_query=how+are+you
          if(typeof vid === "undefined"){
            personal.youtube = extra;
            if(personal.name === "Unsure"){
              response("Sure, I'm opening up video " + personal.youtube + " in a new tab right now!");
            }
            else{
              response("Sure " + personal.name + " I'm opening your request video " + personal.youtube + " in a new tab");
            }
           a.href = "https://www.youtube.com/results?search_query=" + extra;
           a.click();
          }
          else{
            personal.youtube = vid;
             if(personal.name === "Unsure"){
              response("Sure, I'm opening up video " + personal.youtube + " in a new tab right now!");
            }
            else{
              response("Sure " + personal.name + " I'm opening your request video " + personal.youtube + " in a new tab");
            }
           a.href = "https://www.youtube.com/results?search_query=" + extra + " " + vid;
           a.click();
         }


          break;
          case "Netflix":
           // search query
          personal.netflix = prop[0]; // Store preference in user object
          response("Sure, I'm pulling up " + personal.netflix + " now");
           a.href = "http://www.netflix.com/search/" + personal.netflix;
           a.click();

          break;


          case "Search":
          var input = prop[0]; // Search query
          personal.searchq.push(input); // Add search query to object
          response("Searching for " + input + "in a new tab");
           a.href = "https://www.wolframalpha.com/input/?i=" + input;
           a.click();

          break;

          case "Navigation":
          var from = prop[0];
          var to = prop[1];
          if(personal.name === "Unsure"){
            response("Sure, Getting directions from " + from + " to " + to);
          }
          else{
            response("Sure " + personal.name + " Getting directions from " + from + " to " + to);
          }
           a.href = "http://www.bing.com/maps/default.aspx?q=" + from + " to " + to;
           a.click();

          break;

          case "Review":
          var movie = prop[0]; // Move to review
          if(personal.name === "Unsure"){
            response("Sure, I'm pulling up that movie review now!");
          }
          else{
            response("Sure " + personal.name + " I'll pull that up now!");
          }
           a.href = "http://www.rottentomatoes.com/m/" + movie.replace(/\s+/g, '_');
           a.click();
           break;
          default:
          $("#response").html("Thanks for testing!");
          console.log("Failed, read docs again!");
          break;
        }

      }





      /* WHERE ALL THE RESPONSES WILL BE COMING FROM, TODO: SWITCH TO SERVER SIDE WITH NODEJS */
      mic.onerror = function (err) {
        error("Error: " + err);
      };
      mic.onconnecting = function () {
        info("Microphone is connecting");
      };
      mic.ondisconnected = function () {
        info("Microphone is not connected");
      };

      mic.connect("HDV3E4O7DD2GW5CMCZUWNRX3ZFJY7QFW");
      // mic.start();
      // mic.stop();

      function kv (k, v) { // k = "intent" v= actual intent
       
           if (toString.call(v) !== "[object String]") {
          v = JSON.stringify(v);
        }
          console.log("Value of V in function kv = " + v + "Value of K: " + k); // This is to tell which intent is being used
        
        return k + "=" + v + "\n";
      }