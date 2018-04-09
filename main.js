/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flux__ = __webpack_require__(1);


const controlPanelDispatcher = new __WEBPACK_IMPORTED_MODULE_0__flux__["a" /* Dispatcher */]();

const editItem = 'EDIT_ITEM';
/* harmony export (immutable) */ __webpack_exports__["editItem"] = editItem;


const editItemAction = item => {
    return {
        data: item,
        type: EDIT_ITEM
    };
};

class ItemStore extends __WEBPACK_IMPORTED_MODULE_0__flux__["b" /* Store */] {
    getInitialState() {
        let __snapshot = '';
        cart.db.on('value', function (snapshot) {
            __snapshot = snapshot;
        });
        return __snapshot;
    }
    __onDispatch(action) {
        switch (action.type) {
            case EDIT_ITEM:
                this.__state = action.value;
                this.__emitChange();
                break;
        }
    }
    getItems() {
        return this.__state;
    }
}
const cart = {};
cart.db = firebase.database().ref('productsInCart');
cart.subtotal = 0;
cart.estimatedtotal = 0;
cart.totalQuantity = 0;
//cloning the template
cart.template = $('.item');
$('.item').remove();

class shoppingCart {

    renderCart(obj) {

        cart.db.on('value', function (snapshot) {
            cart.itemList = Object.keys(snapshot.val());
            cart.itemList.forEach(item => {
                cart.itemContainer = cart.template.clone();
                cart.itemContainer.find('.itemVariation').html(`${snapshot.val()[item].p_variation.toUpperCase()}`);
                cart.itemContainer.find('.itemName').html(`${snapshot.val()[item].p_name.toUpperCase()}`);
                cart.itemContainer.find('.style').children().eq(0).html(`${snapshot.val()[item].p_style.toUpperCase()}`);
                cart.itemContainer.find('.colour').children().eq(0).html(`${snapshot.val()[item].p_selected_color.name.toUpperCase()}`);
                cart.itemContainer.find('.size').eq(0).children().eq(0).html(`${snapshot.val()[item].p_selected_size.code.toUpperCase()}`);
                cart.itemContainer.find('.size').eq(1).children().eq(0).html(`${snapshot.val()[item].p_selected_size.code.toUpperCase()}`);
                cart.itemContainer.find('.quantity').html(`${snapshot.val()[item].p_quantity}`);
                cart.itemContainer.find('.price').html(`${snapshot.val()[item].p_price * snapshot.val()[item].p_quantity}`);
                cart.itemContainer.find('.itemImage').prop('src', snapshot.val()[item].p_img);
                //on clicking the edit button in an item container 
                cart.itemContainer.find('.editBtn').on('click', function () {
                    $('#editModal').css('display', 'block');
                    $('.variationModal').html(`${snapshot.val()[item].p_variation}`);
                    $('.nameModal').html(`${snapshot.val()[item].p_name}`);
                    $('.modal-price').children().eq(0).html(snapshot.val()[item].p_originalprice);
                    $('.modalImgContainer').children().eq(0).prop('src', snapshot.val()[item].p_img);
                    snapshot.val()[item].p_available_options.colors.forEach(function (color) {
                        let labelBtn = $('<label>').prop('for', color.name);
                        let inputBtn = $('<input type = "radio">').prop('id', color.name).prop('name', 'colors').prop('value', color.name).addClass('color-choices').css('background-color', color.hexcode);
                        if (color.name == snapshot.val()[item].p_selected_color.name) {
                            inputBtn.prop('checked', true);
                        }
                        labelBtn.appendTo($('.color-choices-container'));
                        inputBtn.appendTo($('.color-choices-container'));
                    });
                    $('.sizedrp option').each(e => {
                        if ($(e.currentTarget).val() == snapshot.val()[item].p_selected_size.code) $(e.currentTarget).prop('selected', true);
                    });
                    $('.qtyDrp option').each(e => {
                        if ($(e.currentTarget).val() == snapshot.val()[item].p_quantity) $(e.currentTarget).prop('selected', true);
                    });

                    $('.cross-icon').on('click', () => {
                        $('#editModal').css('display', 'none');
                        $('#editModal').find('.color-choices-container').html('');
                    });
                    window.onclick = function (event) {
                        if (event.target == this.document.getElementById('editModal')) {
                            $('#editModal').css('display', 'none');
                            $('#editModal').find('.color-choices-container').html('');
                        }
                    };
                    $('.edit-modal-btn').off('click').on('click', function (e) {
                        firebase.database().ref('productsInCart/' + item).update({
                            p_quantity: $('.qtyDrp option:selected').val()
                        });
                        firebase.database().ref('productsInCart/' + item + '/p_selected_size/').update({
                            code: $('.sizedrp option:selected').val()
                        });
                        firebase.database().ref('productsInCart/' + item + '/p_selected_color/').update({
                            name: $('input[type=radio]:checked').val()
                        });
                        // controlPanelDispatcher.dispatch(editItemAction(data));
                        $('#editModal').css('display', 'none');
                        $('#editModal').find('.color-choices-container').html('');
                        // window.location.reload();
                    });
                });

                cart.subtotal = cart.subtotal + snapshot.val()[item].p_price * snapshot.val()[item].p_quantity;
                cart.totalQuantity = cart.totalQuantity + parseInt(snapshot.val()[item].p_quantity);
                $('.checkout').before(cart.itemContainer);
                $('.itemNo').html(cart.totalQuantity + ' ITEMS');
            });
            $('.sub-amount').html(cart.subtotal);
            $('est-amount').html(cart.estimatedtotal);
            cart.discount();
        });
    }
}

// discount calculation
cart.discount = () => {
    let discount;
    if (cart.totalQuantity === 3) {
        discount = cart.subtotal * 0.05;
        $('.JF-applied').html('JF05 ');
    } else if (cart.totalQuantity > 3 && cart.totalQuantity <= 6) {
        discount = cart.subtotal * 0.10;
        $('.JF-applied').html('JF10 ');
    } else if (cart.totalQuantity > 10) {
        discount = cart.subtotal * 0.25;
        $('.JF-applied').html('JF25 ');
    } else {
        discount = 0;
        $('.JF-applied').html('NOT ');
    }
    $('.discount-amt').html('-$' + discount);
    $('.est-amount').html(cart.subtotal - discount);
};
$('#total-cost-price').html(cart.estimatedtotal);

// object of shoppingCart class
let cartObj = new shoppingCart();
const itemStore = new ItemStore(controlPanelDispatcher);

itemStore.addListener(state => {
    console.info(`Updated Store`, state);
    render();
});
const render = state => {
    console.info(`Updated Store`, state);
    //function to render all cart items
    cartObj.renderCart(cartObj);
};
render(itemStore.getItems);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Dispatcher__ = __webpack_require__(2);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Dispatcher__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Store__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__Store__["a"]; });



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Dispatcher {
    constructor() {
        this.__listeners = [];
    }
    dispatch(action) {
        this.__listeners.forEach(listener => listener(action));
    }
    register(listener) {
        this.__listeners.push(listener);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Dispatcher;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Store {
    constructor(dispatcher) {
        this.__listeners = [];
        this.__state = this.getInitialState();
        dispatcher.register(this.__onDispatch.bind(this));
    }
    getInitialState() {
        throw new Error("Subclasses must override getInitialState method of a Flux Store");
    }
    __onDispatch() {
        throw new Error("Subclasses must override __onDispatch method of a Flux Store");
    }
    addListener(listener) {
        this.__listeners.push(listener);
    }
    __emitChange() {
        this.__listeners.forEach(listener => listener(this.__state));
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Store;


/***/ })
/******/ ]);