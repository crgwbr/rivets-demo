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
         this.ItemsIndex = [];
      },


      add: function(name) {
         var item = new TODOItem();
         item.Name = name;
         this.Items.push(item);
         this.ItemsIndex.push(item.ID);
      },

      updateStatus: function(id, isDone) {
         var i = this.ItemsIndex.indexOf(id);

         if (i !== -1) {
            this.Items[i].IsDone = isDone;
         }
      }
   });


   UIController = Class.extend({
      __loadTemplate: function(name) {
         var loading = $.get("/templates-jsrender/" + name + ".html");

         loading = loading.then(function(template) {
            if (!$.render[name]) {
               $.templates(name, template);
            }
         });

         return loading;
      },


      __renderTemplate: function(name, context) {
         var loading = this.__loadTemplate(name);

         return loading.then(function() {
            return $.render[name](context);
         });
      }
   });


   TODOListController = UIController.extend({
      init: function(elem) {
         this.elem = elem;
         this.List = new TODOList();
         this.__draw();
      },


      __attachEventHandlers: function() {
         var self = this;

         this.elem.find('.list-name').change(function(event) {
            event.preventDefault();
            self.List.Name = $(this).val();
         });

         this.elem.find('.list-owner').change(function(event) {
            event.preventDefault();
            self.List.Owner = $(this).val();
         });

         this.elem.find('.new-item').submit(function(event) {
            event.preventDefault();
            var name = self.elem.find('.item-name').val();

            if (!name) {
               return;
            }

            self.List.add(name);
            self.__draw();
         });

         this.elem.on('change', 'input[type="checkbox"]', function(event) {
            event.preventDefault();
            var input = $(this),
                isDone = this.checked,
                id = input.attr('id');

            self.List.updateStatus(id, isDone);

            if (isDone) {
               input.parent().addClass('done');
            } else {
               input.parent().removeClass('done');
            }
         });
      },


      __draw: function() {
         var self = this;

         this.__renderTemplate('list', this).done(function(html) {
            self.elem.empty();
            self.elem.append(html);
            self.__attachEventHandlers();

            self.elem.find('.item-name').focus();
         });
      }
   });


   $(function() {
      var elem = $('#app'),
          list = new TODOListController(elem);
      elem.data('todo-list', list);
   });

}());
