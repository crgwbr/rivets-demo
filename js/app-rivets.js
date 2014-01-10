(function() {
   "use strict";
   var TODOList, TODOItem, UIController, TODOListController;


   TODOItem = Class.extend({
      init: function() {
         this.ID = "item-" + Math.floor(Math.random() * 1000000);
         this.Name = "";
         this.IsDone = false;
         this.CreatedOn = new Date();
      }
   });


   TODOList = Class.extend({
      init: function() {
         this.Name = "";
         this.Owner = "";
         this.Items = [];
      },


      add: function(name) {
         var item = new TODOItem();
         item.Name = name;
         this.Items.push(item);
      }
   });


   UIController = Class.extend({
      __loadTemplate: function(name) {
         return $.get("templates-rivets/" + name + ".html");
      }
   });


   TODOListController = UIController.extend({
      init: function(elem) {
         this.elem = elem;
         this.List = new TODOList();
         this.__draw();
      },


      __draw: function() {
         var self = this;

         this.__loadTemplate('list').done(function(html) {
            html = $(html);
            self.elem.empty();
            self.elem.append(html);
            rivets.bind(html, self);
            self.elem.find('.item-name').focus();
         });
      },


      events: {
         addItem: function(event, self) {
            event.preventDefault();
            var input = self.elem.find('.item-name'),
                name = input.val();

            if (!name) {
               return;
            }

            self.List.add(name);
            input.val("");
         }
      }
   });


   rivets.formatters.date = function(value){
     return value.toDateString();
   };


   $(function() {
      var elem = $('#app'),
          list = new TODOListController(elem);
      elem.data('todo-list', list);
   });

}());
