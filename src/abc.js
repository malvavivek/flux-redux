import {
    Dispatcher,
    Store
} from './flux';
const controlPanelDispatcher = new Dispatcher();
export const EDIT_PRODUCT = `EDIT_PRODUCT`;
let discountValue = 0,
    subtotal = 0,
    shippingValue = 0,
    totalProducts = 0,
    discOnSub = 0,
    selectedColor, totalItems = 0;
let database = firebase.database().ref('productsInCart');
var viewObject = {};

const editProductUpdateAction = (product) => {
    return {
        type: EDIT_PRODUCT,
        value: product
    }
};

class ItemStore extends Store {
    getInitialState() {
        let __snapshot = '';
        viewObject.init();
        database.on('value', function (snapshot) {
            __snapshot = snapshot;
        });
        return __snapshot;

    }
    __onDispatch(action) {
        switch (action.type) {
            case EDIT_PRODUCT:
                this.__state = action.value;
                this.__emitChange();

                break;
            default:
                console.log('error');
        }
    }
    getProducts() {
        return this.__state;
    }
}

class CheckoutItems {
    constructor(item) {
        this.pID = item.p_id;
        this.pName = item.p_name;
        this.pImage = item.p_src;
        this.pPrice = item.p_price;
        this.pStyle = item.p_style;
        this.pQuantity = item.p_quantity;
        this.pSelectedColor = Object.assign(item.p_selected_color);
        this.pSelectedSize = Object.assign(item.p_selected_size);
        this.availableColors = Object.assign(item.p_available_options.colors);
        this.availableSizes = Object.assign(item.p_available_options.sizes);
        this.availableOptions = Object.assign(item.p_available_options);
    }

    populateList(index, totalItems = 4) {
        let $newProduct = $('.item-template').clone();
        let $lineContainer = $('.line-template').clone();
        $newProduct.addClass('items');
        $newProduct.removeClass('item-template');
        $lineContainer.removeClass('line-template');
        $newProduct.attr('id', this.pID);
        $newProduct.find('.edit-btn').attr('id', this.pID);
        $newProduct.find('#p-image').attr('src', this.pImage);
        $newProduct.find('.p-style-code').html(`${this.pStyle}`);
        $newProduct.find('.p-size-value').html(`${this.pSelectedSize.code}`);
        $newProduct.find('.p-name').html(`${this.pName}`);
        $newProduct.find('.p-color-name').html(`${this.pSelectedColor.name}`);
        $newProduct.find('.p-qty-value').html(`${this.pQuantity}`);
        $newProduct.find('.p-price-value').html(`<sup>$</sup>${this.pPrice}`);
        $('.item-container').append($newProduct);
        if (index < totalItems - 1)
            $('.item-container').append($lineContainer);
        totalProducts = totalProducts + this.pQuantity;
        subtotal = subtotal + this.pPrice;
        /* Edit Modal functionality
        1)populating the modal
        2)saving any changes made in the modal */
        $newProduct.find('#' + this.pID).off('click').on('click', (event) => {
            event.preventDefault();
            viewObject.clearModal(); //clearing the modal before opening
            //1)populating the modal
            $('.modal-body').find('img').attr('src', this.pImage);
            $('.p-name-modal').html(`${this.pName}`);
            $('.p-style-modal').html(`${this.pStyle}`);
            $('.p-price-modal').html(`<sup>$</sup>${this.pPrice}`);
            $('#selected-size').text(`${this.pSelectedSize.code}`);
            $('#selected-qty').text(`${this.pQuantity}`);
            for (let j = 0; j < this.availableColors.length; j++) {
                let $newColor = $('.color-box-clone').clone();
                $newColor.addClass('avaialable-color');
                $newColor.removeClass('color-box-clone');
                $newColor.find('.color-box').attr('id', this.availableColors[j].name);
                $newColor.find('.color-box').css('background-color', this.availableColors[j].hexcode);
                $('.to-append-color').append($newColor);
            }
            for (let j = 0; j < this.availableSizes.length; j++) {
                $('.size-dropdown').append(`<li> ${this.availableSizes[j].code} </li>`);
            }
            $('.size-dropdown li').click(function () {
                $('#selected-size').text(`${$(this).text()}`);
            });
            $('.qty-dropdown li').click(function () {
                $('#selected-qty').text(`${$(this).text()}`);
            });
            $('.color-box').on('click', (event) => {
                $newProduct.find('.p-color-name').html(`${event.currentTarget.id}`);
                this.pSelectedColor.name = event.currentTarget.id;
                this.pSelectedColor.code = this.getColorHex(this.pSelectedColor.name);
            });
            //2)saving the changes made in the modal and displaying it to the user
            $('.save-changes').off('click').on('click', () => {
                $newProduct.find('.p-qty-value').html(`${ $('#selected-qty').html()}`);
                $newProduct.find('.p-size-value').html(`${$('#selected-size').html()}`);
                this.pQuantity = $('#selected-qty').html();
                this.pSelectedSize.name = this.getSizeName(this.pSelectedSize.name);
                this.pSelectedSize.code = $('#selected-size').html();
                this.updateData();
                let updateDataProducts = '';
                database.on('value', function (snapshot) {
                    updateDataProducts = snapshot;
                });
                controlPanelDispatcher.dispatch(editProductUpdateAction(updateDataProducts));
                $('#myEditModal').modal('hide');
            });
        });
    }
    updateData() {
        let i = parseInt(this.pID);
        i = i - 1;
        //set method to update data
        database.child(i).set({
            c_currency: '$',
            p_available_options: this.availableOptions,
            p_id: this.pID,
            p_name: this.pName,
            p_orignalprice: this.pPrice,
            p_price: this.pPrice,
            p_quantity: this.pQuantity,
            p_selected_color: this.pSelectedColor,
            p_selected_size: this.pSelectedSize,
            p_style: this.pStyle,
            p_variation: this.pStyle,

        });
    }
    /* function to get hex code of given color */
    getColorHex(name) {
        let hex = "";
        switch (name) {
            case 'green':
            case 'GREEN':
                hex = '#A3D2A1';
                break;
            case 'yellow':
            case 'YELLOW':
                hex = '#F9F8E6';
                break;
            case 'red':
            case 'RED':
                hex = '#ED99A8';
                break;
            case 'pink':
            case 'PINK':
                hex = '#F1DDEF';
                break;
            case 'blue':
            case 'BLUE':
                hex = '#1169BD';
                break;
            default:
                hex = '#000';
        }
        return hex;
    }
    /* function to get size name of the entered size to display to the user */
    getSizeName(sizeCode) {
        let name = "";
        switch (sizeCode) {
            case 's':
            case 'S':
                name = 'small';
                break;
            case 'm':
            case 'M':
                name = 'medium';
                break;
            case 'l':
            case 'L':
                name = 'large';
                break;
            case 'xl':
            case 'XL':
                name = 'extra large';
                break;
            default:
                name = 'small'
        }
        return name;
    }
}
viewObject.init = function () {
    viewObject.productTemplate = document.getElementsByClassName('item-template');
    database.on('value', function (snapshot) {
        var products = Object.keys(snapshot.val());
        totalItems = products.length;
        products.forEach((i) => {
            var item = {
                p_id: snapshot.val()[i].p_id,
                p_name: snapshot.val()[i].p_name,
                p_src: '../assets/T' + (i) + '.jpg',
                p_price: snapshot.val()[i].p_price,
                p_style: snapshot.val()[i].p_style,
                p_quantity: snapshot.val()[i].p_quantity,
                p_selected_color: Object.assign(snapshot.val()[i].p_selected_color),
                p_selected_size: Object.assign(snapshot.val()[i].p_selected_size),
                p_available_options: Object.assign(snapshot.val()[i].p_available_options),
            };
            var item = new CheckoutItems(item);
            item.populateList(i, totalItems);
        });
        viewObject.billGenerator();
    });
}
viewObject.billGenerator = () => {
    if (subtotal < 50) {
        shippingValue = 5;
        $('.shipping-value').html(`<sup>$</sup>${shippingValue}`);
    } else {
        shippingValue = 0;
        $('.shipping-value').html(`FREE`);
    }
    $('.item-template').hide();
    $('.line-template').hide();
    $('.subtotal-value').html(`&nbsp;<sup>$</sup>${subtotal}`);
    $('#items-selected').html(`${totalItems}`);
    viewObject.subDiscCal();
    viewObject.costCalculate();
    $('.promo-apply').on('click', function () {
        viewObject.discount(subtotal);
    });
}
/* function to calculate discount on the basis of total items in the cart-REQUIRED FUNCTIONALITY */
viewObject.subDiscCal = () => {
    let disc = 0;
    if (totalProducts == 3) {
        disc = 5 / 100;
    } else if (totalProducts > 3 && totalProducts < 6) {
        disc = 10 / 100;
    } else if (totalProducts > 6) {
        disc = 25 / 100;
    } else {
        disc = 0;
    }
    discOnSub = disc * subtotal;
    $('.disc-on-subtotal').html(`-<sup>$</sup>${discOnSub}`)
}
/* function to calculate discount on the basis of COUPON CODE in the cart-ADDITIONAL FUNCTIONALITY */
viewObject.discount = (subtotal = 59) => {
    let promocode = $('.promotion-code').val();
    let discount = 0;
    if (promocode) {
        if (promocode == 'JF10') {
            discount = 10 / 100;
        } else if (promocode == 'AP420') {
            discount = 4 / 100;
        } else if (promocode == 'SS560') {
            discount = 15 / 100;
        } else if (promocode == 'JF10') {
            discount = 15 / 100;
        } else
            discount = -1;
    }
    discountValue = discount * subtotal;
    $('.p-code-val').html(`${promocode}`);
    if (discount != -1) {
        $('.p-code-discount').html(`<sup>$</sup>${discountValue}`);
        $('.discount-not-applicable').html(`successfully applied*`);
    } else
        $('.discount-not-applicable').html(`This promo code is not valid*`);
    viewObject.costCalculate();
    $('.promotion-code').on('focus', function () {
        $('.discount-not-applicable').html('');
    });
}
/* function to calculate total payable amount(excluding tax) */
viewObject.costCalculate = () => {
    let estimatedCost = subtotal + shippingValue - discountValue - discOnSub;
    $('.estimated-value').html(`<sup>$</sup>${estimatedCost}`);
}
viewObject.clearModal = () => {
    $('.p-name-modal').html('');
    $('.p-price-modal').html('');
    $('.color-available-1').css('background-color', 'white');
    $('.color-available-2').css('background-color', 'grey');
    $('.size-dropdown').html('');
    $('#selected-size').html(`Choose option`);
    $('#selected-qty').html(`Choose option`);
    $('.avaialable-color').remove();
    selectedColor = '';
}


const itemStore = new ItemStore(controlPanelDispatcher);

itemStore.addListener((state) => {
    console.info(`Updated Store`, state);
    render();
});
const render = (state) => {
    console.info(`Updated Store`, state);
    viewObject.init();
}
render(itemStore.getProducts);