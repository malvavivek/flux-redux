import {
    Dispatcher,
    Store
} from './flux';

const controlPanelDispatcher = new Dispatcher();

export const editItem = 'EDIT_ITEM';

const editItemAction = (item) => {
    return {
        data: item,
        type: EDIT_ITEM
    }
};

class ItemStore extends Store {
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
            cart.itemList.forEach((item) => {
                cart.itemContainer = cart.template.clone();
                cart.itemContainer.find('.itemVariation').html(`${snapshot.val()[item].p_variation.toUpperCase()}`);
                cart.itemContainer.find('.itemName').html(`${snapshot.val()[item].p_name.toUpperCase()}`);
                cart.itemContainer.find('.style').children().eq(0).html(`${snapshot.val()[item].p_style.toUpperCase()}`);
                cart.itemContainer.find('.colour').children().eq(0).html(`${snapshot.val()[item].p_selected_color.name.toUpperCase()}`);
                cart.itemContainer.find('.size').eq(0).children().eq(0).html(`${snapshot.val()[item].p_selected_size.code.toUpperCase()}`);
                cart.itemContainer.find('.size').eq(1).children().eq(0).html(`${snapshot.val()[item].p_selected_size.code.toUpperCase()}`);
                cart.itemContainer.find('.quantity').html(`${snapshot.val()[item].p_quantity}`);
                cart.itemContainer.find('.price').html(`${snapshot.val()[item].p_price * snapshot.val()[item].p_quantity}`);
                cart.itemContainer.find('.itemImage').prop('src', (snapshot.val()[item].p_img));
                //on clicking the edit button in an item container 
                cart.itemContainer.find('.editBtn').on('click', function () {
                    $('#editModal').css('display', 'block');
                    $('.variationModal').html(`${snapshot.val()[item].p_variation}`);
                    $('.nameModal').html(`${snapshot.val()[item].p_name}`);
                    $('.modal-price').children().eq(0).html(snapshot.val()[item].p_originalprice);
                    $('.modalImgContainer').children().eq(0).prop('src', (snapshot.val()[item].p_img));
                    snapshot.val()[item].p_available_options.colors.forEach(function (color) {
                        let labelBtn = $('<label>').prop('for', color.name);
                        let inputBtn = $('<input type = "radio">').prop('id', color.name).prop('name', 'colors').prop('value', color.name).addClass('color-choices').css('background-color', color.hexcode);
                        if (color.name == snapshot.val()[item].p_selected_color.name) {
                            inputBtn.prop('checked', true);
                        }
                        labelBtn.appendTo($('.color-choices-container'));
                        inputBtn.appendTo($('.color-choices-container'));
                    });
                    $('.sizedrp option').each((e) => {
                        if ($(e.currentTarget).val() == snapshot.val()[item].p_selected_size.code)
                            $(e.currentTarget).prop('selected', true);
                    });
                    $('.qtyDrp option').each((e) => {
                        if ($(e.currentTarget).val() == snapshot.val()[item].p_quantity)
                            $(e.currentTarget).prop('selected', true);
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
                    }
                    $('.edit-modal-btn').off('click').on('click', function (e) {
                        firebase.database().ref('productsInCart/' + item).update({
                            p_quantity: $('.qtyDrp option:selected').val(),
                        });
                        firebase.database().ref('productsInCart/' + item + '/p_selected_size/').update({
                            code: $('.sizedrp option:selected').val(),
                        });
                        firebase.database().ref('productsInCart/' + item + '/p_selected_color/').update({
                            name: $('input[type=radio]:checked').val(),
                        });
                        controlPanelDispatcher.dispatch(editItemAction(data));
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
    $('.discount-amt').html('-$' + (discount));
    $('.est-amount').html(cart.subtotal - discount);
}
$('#total-cost-price').html(cart.estimatedtotal);

// object of shoppingCart class
let cartObj = new shoppingCart();
const itemStore = new ItemStore(controlPanelDispatcher);

itemStore.addListener((state) => {
    console.info(`Updated Store`, state);
    render();
});
const render = (state) => {
    console.info(`Updated Store`, state);
    //function to render all cart items
    cartObj.renderCart(cartObj);
}

render(itemStore.getItems);