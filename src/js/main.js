let $ = jQuery;

$(document).ready(function () {
    mobileMenu();
    initTable();
    tableCounter();
    tableNav();
    tableMobile();
    searchCustom();
});

function mobileMenu() {
    let menuBtn = $('.nav_btn');

    menuBtn.on('click', function () {
        $(this).toggleClass('active');

        $('#nav').slideToggle();
    })
}

function initTable() {
    let rowsToShow = 8;

    $(".table").fancyTable({
        pagination: true,
        perPage: rowsToShow,
        globalSearch: true,
        inputPlaceholder: 'Search'
    });

    // move default search to new wrapper
    let searchInput = $('.fancySearchRow input');
    let newSearchWrap = $('.search-wrapper');

    newSearchWrap.append(searchInput);
}

function searchCustom() {
    $('.search-wrapper input').on('input', function () {
        if ($(this).val() !== '') {
            $('.table-counter').hide();
        } else {
            $('.table-counter').show();
        }

        setTimeout(function () {
            tableNav();
        }, 200)
    })
}

function tableCounter() {
    $(".table").each(function () {
        if ($('.table-counter').length > 0) {
            $('.table-counter').remove();
        }

        let rowsCounterWrap = $(this).find('tfoot tr');
        let rowsTotal = $(".table").find('tbody tr').length;
        let rowVisibleStart = $('tbody tr:visible').first().index() + 1;
        let rowVisibleEnd = $('tbody tr:visible').last().index() + 1;

        rowsCounterWrap.prepend(`<td class="table-counter">Showing data ${rowVisibleStart} to ${rowVisibleEnd} of ${rowsTotal} entries</td>`);
    });
}

function tableNav() {

    let arrowsWrap = $('.table .pag');
    if (arrowsWrap.find('a').length > 1) {
        arrowsWrap.prepend('<span class="btn btn-light btn-prev">Prev</span>');
        arrowsWrap.append('<span class="btn btn-light btn-next">Next</span>');

        $('.table .btn-prev').on('click', function () {
            let table = $(this).parents('.table');
            let activePag = table.find('.pag .active');
            let prevPag = activePag.prev();

            if (!prevPag.hasClass('btn-prev')) {
                prevPag.trigger('click')
            }
        })

        $('.table .btn-next').on('click', function () {
            let table = $(this).parents('.table');
            let activePag = table.find('.pag .active');
            let nextPag = activePag.next();

            if (!nextPag.hasClass('btn-next')) {
                nextPag.trigger('click')
            }
        })
    };
}

function tableMobile() {
    var titles = [];

    $('.table').each(function () {

        // get the data from the headings
        $(this).find("thead th").each(function (i) {
            titles[i] = $(this).text();
        })

        // apply headings to the td in each row
        $(this).find("tbody tr").each(function () {
            var tableRow = $(this);

            tableRow.find('td').each(function (j) {
                $(this).attr('data-th', titles[j]);
            })
        })
    })
}
