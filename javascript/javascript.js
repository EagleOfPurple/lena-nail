$(document).ready(function($) {
    "use strict";

    let galleryBtnContainer = $(".section-gallery__btn-container");
    let galleryBody = $(".gallery-toggle");
    let galleryHeader = $(".section-gallery__header");
    let picture = $('.aside__picture');
    let aside = $('.aside');
    let imgCont = $('.img-container');
    let navBtnPrev = $('.nav-btn_prev');
    let navBtnNext = $('.nav-btn_next');
    let prev;
    let next;
    let current;
    let body = $('body');


    // Открытие галереи
    galleryBtnContainer.on('click', toggleGallery);

    function toggleGallery() {
        let displayProp = galleryBody.css('display');
        let clientWidth = $(window).width();
        let propValue = ['10vh', '2vh'];
        if (displayProp !== "none" && clientWidth > 1000) propValue = ['25vh', '7vh'];

        galleryHeader.animate({
            height: propValue[0],
            paddingTop: propValue[1]
        });

        galleryBody.slideToggle('slow');
        checkBtn();
    }

    // Открытие галереи при клике на кнопку навигации
    $('.footer__link_gal').on('click', function() {
        toggleGallery();
    });


    // Открытие картинок в галерее
    $('.section-gallery__body').on('click', function(e) {
        e.preventDefault();
        disableScroll();

        current = e.target;
        prev = getNearest(e.target, 'prev');
        next = getNearest(e.target, 'next');
        checkBtn();

        let href = getHref(e.target);

        addImg(href[0]);

        aside.fadeIn();
    });

    function checkBtn() {
        if (prev === null) {
            navBtnPrev.prop('disabled', true);
        } else if (next === null) {
            navBtnNext.prop('disabled', true);
        } else if (navBtnPrev.prop('disabled')) {
            navBtnPrev.prop('disabled', false);
        } else if (navBtnNext.prop('disabled')) {
            navBtnNext.prop('disabled', false);
        } else {
            return;
        }
    }

    function getNearest(target, pos) {
        let position = $(target).parents('.section-gallery__link');

        switch (pos) {
            case 'prev':
                position = position[0].previousElementSibling;
                break;
            case 'next':

                position = position[0].nextElementSibling;
                break;
        }

        if (position === null) {
            return null;
        }

        let targEl = $(position).find('.section-gallery__img');
        return targEl[0];
    }

    function getHref(target) {
        let reg = /gallery-[\w]+\([\d]+\)/;
        let href = target.currentSrc.match(reg);
        return href;
    }

    function addImg(href) {
        let string = `<source media="(max-width: 980px)" type="image/webp" srcset='img/gallery/preview-${href}.webp 1x, img/gallery/lg-${href}.webp 2x'>
        <source type="image/webp" srcset='img/gallery/lg-${href}.webp'>
        <source media="(max-width: 980px)" srcset='img/gallery/preview-${href}.jpg 1x, img/gallery/lg-${href}.jpg 2x'>
        <img id="added-img" src="img/gallery/lg-${href}.jpg" alt="Фотография маникюра">`;
        picture.html(string);
        $('#added-img').animate({
            opacity: 1
        }, 200);
    }

    imgCont.on('click', function(e) {
        e.preventDefault();

        if (e.target === this) {
            aside.fadeOut();
            navBtnNext.prop('disabled', false);
            navBtnPrev.prop('disabled', false);
            enableScroll();
        } else if (e.target.classList.contains('nav-btn_prev')) {
            let href = getHref(prev);
            addImg(href);
            next = current;
            current = prev;
            prev = getNearest(prev, 'prev');
            checkBtn();
        } else if (e.target.classList.contains('nav-btn_next')) {
            let href = getHref(next);
            addImg(href);
            prev = current;
            current = next;
            next = getNearest(next, 'next');
            checkBtn();
        } else {
            return;
        }
    });

    // Отклик для перехода клавишей Tab
    document.addEventListener('focusin', function(event) {
        let target = $(event.target);

        if (target.hasClass('focusin-type-two')) {
            target = target.parent();
        }

        let className = target[0].classList[0] + '_focused';
        target[0].classList.add(className);
    });

    document.addEventListener('focusout', focusOut);

    function focusOut(event) {
        let target = $(event.target);

        if (target.hasClass('focusin-type-two')) {
            target = target.parent();
        }

        let className = target[0].classList[0] + '_focused';
        target[0].classList.remove(className);
    }

    // Плавный скролл навигации
    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        let href = $(this).attr('href');

        scrollSlowly(href);

        $(this).mouseout(focusOut);
    });

    function scrollSlowly(href) {
        let offset = $(href).offset().top;
        $('body,html').animate({
            scrollTop: offset
        }, 600);
    }

    // Форма 
    $('input[type="tel"]').inputmask({ "mask": "+7 (999) 999-99-99" });
    $('.submit-form').on('submit', function(e) {
        e.preventDefault();
    });

    $('#submit-form').validate({
        errorPlacement() {
            return true;
        },
        rules: {
            firstName: {
                required: true
            },
            tel: {
                required: true
            },
        },
        submitHandler(form) {
            let dataForm = $(form);

            $.ajax({
                type: 'POST',
                url: 'mail.php',
                data: dataForm.serialize(),
            }).done(() => {
                dataForm.tarigger('reset');
            });

            return false;
        }

    });

    // Поблочный скролл
    //Firefox
    $(document).bind('DOMMouseScroll', function(e) {
        let clientHeight = $(window).height();
        let clientWidth = $(window).width();
        if (clientHeight < 780 || clientWidth < 1000 || body.hasClass('disable-scroll')) return;

        if (e.originalEvent.detail > 0) {
            scrollDown();
        } else {
            scrollUp();
        }
    });

    //IE, Opera, Safari
    $(document).bind('mousewheel', function(e) {
        let clientHeight = $(window).height();
        let clientWidth = $(window).width();
        if (clientHeight < 780 || clientWidth < 1000 || body.hasClass('disable-scroll')) return;

        if (e.originalEvent.wheelDelta < 0) {
            scrollDown();
        } else {
            scrollUp();
        }

    });

    $(document).keydown(function(e) {
        let clientHeight = $(window).height();
        let clientWidth = $(window).width();
        if (clientHeight < 780 || clientWidth < 1000 || body.hasClass('disable-scroll')) return;

        switch (e.keyCode) {
            case 38:
                scrollUp();
                break;
            case 40:
                scrollDown();
                break;
        }
    })

    function scrollDown() {
        let galleryOffsetTop = parseInt($('#gallery-link').offset().top);
        let signUpOffsetTop = parseInt($('#sign-up-link').offset().top);
        let st = parseInt($(window).scrollTop());
        if (st < galleryOffsetTop) {
            scrollSlowly('#gallery-link');
        } else if (st >= galleryOffsetTop && st < signUpOffsetTop) {
            let galOpened = $('.gallery-toggle').css('display') !== 'none';
            if (galOpened) {
                $('.gallery-toggle').css({ 'display': 'none' });
                galleryHeader.css({
                    'height': '25vh',
                    'padding-top': '7vh'
                });
                setTimeout(function() { scrollSlowly('#sign-up-link'); }, 50);
                return;
            }
            scrollSlowly('#sign-up-link');
        } else {
            scrollSlowly('#contacts-link');
        }
    }

    function scrollUp() {
        let galleryOffsetBottom = parseInt($('#sign-up-link').offset().top);
        let signUpOffsetBottom = parseInt($('.footer').offset().top);
        let sb = parseInt($(window).scrollTop() + $(window).height());

        if (sb <= galleryOffsetBottom) {
            let galOpened = $('.gallery-toggle').css('display') !== 'none';
            if (galOpened) {
                $('.gallery-toggle').css({ 'display': 'none' });
                galleryHeader.css({
                    'height': '25vh',
                    'padding-top': '7vh'
                });

                setTimeout(function() {
                    scrollSlowly('#about-link');
                }, 50);
                return;
            }
            scrollSlowly('#about-link');
        } else if (sb <= signUpOffsetBottom && sb > galleryOffsetBottom) {
            scrollSlowly('#gallery-link');
        } else {
            scrollSlowly('#sign-up-link');
        }
    }

    // Блокировка скролла
    function disableScroll() {
        let scrollTop = galleryHeader.offset().top;
        body.toggleClass('disable-scroll');
        body.data('top', scrollTop);
        $(body).css({
            top: '-' + scrollTop + 'px'
        });
        if ($(window).width() < 1000) {
            $(body).css({
                paddingRight: '2vh'
            });
        }
    }

    function enableScroll() {
        let scrollTop = body.data('top');;
        body.toggleClass('disable-scroll');
        body.removeData('top');
        $(body).css({
            top: 0,
            paddingRight: 0
        });
        $(Window).scrollTop(scrollTop);
    }
});