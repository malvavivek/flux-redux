!function(t){var e={};function a(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=t,a.c=e,a.d=function(t,e,o){a.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},a.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=0)}([function(t,e,a){"use strict";a.r(e);a.d(e,"editItem",function(){return o});new class{constructor(){this.__listeners=[]}dispatch(t){this.__listeners.forEach(e=>e(t))}register(t){this.__listeners.push(t)}};const o="EDIT_ITEM";!function(t){t.db=firebase.database().ref("productsInCart"),t.subtotal=0,t.estimatedtotal=0,t.totalQuantity=0,t.template=$(".item"),$(".item").remove(),t.renderCart=function(e){t.db.on("value",function(e){t.itemList=Object.keys(e.val()),t.itemList.forEach(a=>{t.itemContainer=t.template.clone(),t.itemContainer.find(".itemVariation").html(`${e.val()[a].p_variation.toUpperCase()}`),t.itemContainer.find(".itemName").html(`${e.val()[a].p_name.toUpperCase()}`),t.itemContainer.find(".style").children().eq(0).html(`${e.val()[a].p_style.toUpperCase()}`),t.itemContainer.find(".colour").children().eq(0).html(`${e.val()[a].p_selected_color.name.toUpperCase()}`),t.itemContainer.find(".size").eq(0).children().eq(0).html(`${e.val()[a].p_selected_size.code.toUpperCase()}`),t.itemContainer.find(".size").eq(1).children().eq(0).html(`${e.val()[a].p_selected_size.code.toUpperCase()}`),t.itemContainer.find(".quantity").html(`${e.val()[a].p_quantity}`),t.itemContainer.find(".price").html(`${e.val()[a].p_price*e.val()[a].p_quantity}`),t.itemContainer.find(".itemImage").prop("src",e.val()[a].p_img),t.itemContainer.find(".editBtn").on("click",function(){$("#editModal").css("display","block"),$(".variationModal").html(`${e.val()[a].p_variation}`),$(".nameModal").html(`${e.val()[a].p_name}`),$(".modal-price").children().eq(0).html(e.val()[a].p_originalprice),$(".modalImgContainer").children().eq(0).prop("src",e.val()[a].p_img),e.val()[a].p_available_options.colors.forEach(function(t){let o=$("<label>").prop("for",t.name),i=$('<input type = "radio">').prop("id",t.name).prop("name","colors").prop("value",t.name).addClass("color-choices").css("background-color",t.hexcode);t.name==e.val()[a].p_selected_color.name&&i.prop("checked",!0),o.appendTo($(".color-choices-container")),i.appendTo($(".color-choices-container"))}),$(".sizedrp option").each(()=>{$(this).val()==e.val()[a].p_selected_size.code&&$(this).prop("selected",!0)}),$(".qtyDrp option").each(()=>{$(this).val()==e.val()[a].p_quantity&&$(this).prop("selected",!0)}),$(".cross-icon").on("click",()=>{$("#editModal").css("display","none"),$("#editModal").find(".color-choices-container").html("")}),window.onclick=function(t){t.target==this.document.getElementById("editModal")&&($("#editModal").css("display","none"),$("#editModal").find(".color-choices-container").html(""))},$(".edit-modal-btn").off("click").on("click",function(t){firebase.database().ref("productsInCart/"+a).update({p_quantity:$(".qtyDrp option:selected").val()}),firebase.database().ref("productsInCart/"+a+"/p_selected_size/").update({code:$(".sizedrp option:selected").val()}),firebase.database().ref("productsInCart/"+a+"/p_selected_color/").update({name:$("input[type=radio]:checked").val()}),$("#editModal").css("display","none"),$("#editModal").find(".color-choices-container").html(""),window.location.reload()})}),t.subtotal=t.subtotal+e.val()[a].p_price*e.val()[a].p_quantity,t.totalQuantity=t.totalQuantity+parseInt(e.val()[a].p_quantity),$(".checkout").before(t.itemContainer),$(".itemNo").html(t.totalQuantity+" ITEMS")}),$(".sub-amount").html(t.subtotal),$("est-amount").html(t.estimatedtotal),t.discount()})},t.discount=(()=>{let e;3===t.totalQuantity?(e=.05*t.subtotal,$(".JF-applied").html("JF05 ")):t.totalQuantity>3&&t.totalQuantity<=6?(e=.1*t.subtotal,$(".JF-applied").html("JF10 ")):t.totalQuantity>10?(e=.25*t.subtotal,$(".JF-applied").html("JF25 ")):(e=0,$(".JF-applied").html("NOT ")),$(".discount-amt").html("-$"+e),$(".est-amount").html(t.subtotal-e)}),$("#total-cost-price").html(t.estimatedtotal),t.renderCart()}({})}]);