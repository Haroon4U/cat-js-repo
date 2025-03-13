  var root_url =location.protocol;
// var root_url =location.protocol;
let isLoading = false;
// Datatables
$(document).on('keypress','input[type="search"]',function(){
  $(document).unbind(".mine");
})

$.extend( true, $.fn.dataTable.defaults, {
  serverSide: true,
  processing: true,
  dom: 'Rfrt<""<"row"<"col"><"col">>>',
      "info": false, 
      language: {
          "emptyTable": "<div  style='user-select: none;'><img src='/web/assets/plugins/DataTables/no_data.svg' width='160' height='160'><br><p>Nothing to Show Here</p><p style='font-size:small;margin-top:-5px'>Please add a new-entity or manage the data table to see the content here</p><p style='font-size:small;margin-top:-5px'>Thank you</p></div>",
          "search": '<i class="fa fa-search"></i>',
              "searchPlaceholder": "search",
              "paginate": {
              "previous": '<i class="fa fa-angle-left"></i>',
              "next": '<i class="fa fa-angle-right"></i>'
          },
          "lengthMenu": "_MENU_ entries",
      },
      columnDefs: [
        {           
          responsive: true,
          targets: 0,
        },
    ],
  pageLength: 100,
});
function localStorageNextPreviousNavigator(rootId, rowIds) {
  // Clear previous local storage values
  localStorage.removeItem('root_id');
  localStorage.removeItem('rowsIds');

  // Create new local storage entries
  localStorage.setItem('root_id', rootId);
  localStorage.setItem('rowsIds', JSON.stringify(rowIds));
}

var NextPreviousNavigator = {
  init: (context) => {
      $(document)
          .off('click', '.c_pager_previous_record, .c_pager_next_record')
          .on('click', '.c_pager_previous_record, .c_pager_next_record', function (event) {
              if (context.isFormDirty && !confirm('You have unsaved changes. Are you sure you want to proceed without saving?')) {
                  event.preventDefault();
                  return;
              }
              context.isFormDirty = false;
              const direction = $(this).hasClass('c_pager_previous_record') ? 'previous' : 'next';
              NextPreviousNavigator.navigate(context, direction);
          });
      NextPreviousNavigator.updateNavigationButtons(context);
  },
  
  getNextId: (context) => {
      if (!Array.isArray(context.rowsIds) || context.rowsIds.length === 0 || context.currentId === null) {
          return null;
      }
      const currentIndex = context.rowsIds.indexOf(context.currentId);
      if (currentIndex >= 0 && currentIndex < context.rowsIds.length - 1) {
          return context.rowsIds[currentIndex + 1];
      }
      return null;
  },
  
  getPrevId: (context) => {
      if (!Array.isArray(context.rowsIds) || context.rowsIds.length === 0 || context.currentId === null) {
          return null;
      }
      const currentIndex = context.rowsIds.indexOf(context.currentId);
      if (currentIndex > 0) {
          return context.rowsIds[currentIndex - 1];
      }
      return null;
  },
  
  navigate: (context, direction) => {
      let id = null;
      if (direction === 'next') {
          id = NextPreviousNavigator.getNextId(context);
      } else if (direction === 'previous') {
          id = NextPreviousNavigator.getPrevId(context);
      }
      if (id) {
          const url = `${root_url}/${context.endpoint}`;
          const postData = {
              'root_id': id,
              'rowsIds': context.rowsIds,
          };

          context.viewContentPopup(url, 'post', postData);
          context.currentId = id;
          NextPreviousNavigator.updateNavigationButtons(context);
      }
  },
  
  updateNavigationButtons: (context) => {
      const nextId = NextPreviousNavigator.getNextId(context);
      const prevId = NextPreviousNavigator.getPrevId(context);
      $('.c_pager_next_record').prop('disabled', !nextId);
      $('.c_pager_previous_record').prop('disabled', !prevId);
  }
};


$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
  if (jqxhr.status === 419 || jqxhr.status === 401) {
    window.location.href = '/login';
  }
});
function handleAjaxError(xhr) {
  let errorMessage = "Error Occurred.";
  let errorDetails = '';

  if (xhr && xhr.status) {
      if (xhr.status === 404) {
        errorDetails = "Page not found. Please check the URL or contact support.";
      } else if (xhr.status === 500) {
          errorMessage = "An internal server error occurred.";
          errorDetails = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : xhr.responseText;
      } else if (xhr.status === 422) {
          errorMessage = "Validation Errors:";
          if (xhr.responseJSON && xhr.responseJSON.errors) {
            $.each(xhr.responseJSON.errors, function (field, messages) {
                errorDetails += `<strong>${field}:</strong> ${messages.join(", ")} <br>`;
            });
          } else if (xhr.responseJSON && xhr.responseJSON.message) {
            errorDetails = xhr.responseJSON.message;
          }
      } else if (xhr.responseJSON && xhr.responseJSON.error) {
          errorDetails = xhr.responseJSON.error;
      } else if (xhr.responseText) {
          errorDetails = xhr.responseText;
      }
  } else {
    errorDetails = xhr.message || '';
  }

  displayError(errorMessage, errorDetails);
}

function displayError(message, details) {
    const modalHtml = `
        <div class="modal fade" data-bs-backdrop="false" data-bs-keyboard="false" id="errorModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header page-header" style="margin-bottom:0px">
                        <div class="d-md-flex align-items-center">
                            <div class="page-title ">
                                <h5 class="modal-title">${message}</h5>
                            </div>
                        </div>
                        <div class="btn-list d-md-flex d-block">
                            <button class="btn btn-icon btn-primary btn-square" onclick="copyToClipboard()"><i class="fas fa-clipboard"></i></button>
                            <button class="btn btn-danger btn-square" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div>${details}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('body').append(modalHtml);
    $('#errorModal').modal('show');
    $('#errorModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}
function handleError(e) {
  $('#messageDialog-modal .modal-body').html(e);
  $('#messageDialog-modal').modal('show');
}
function clearSelection() {
    if (window.getSelection) {
        var selection = window.getSelection();
        selection.removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}
$(window).on("load", function () {
    $("#global-loader").fadeOut(300, function() {
      $('body').removeClass('overflow-hidden'); 
    });
});
$(window).on("beforeunload", function () {
  $("#global-loader").fadeIn(300); 
  $('body').addClass('overflow-hidden'); 
});
function loadingStart() {
    if (isLoading) return; 
    isLoading = true; 
    $('#search-module').val(''); 
    $('#module-list').empty(); 
    clearSelection(); 
    $("#global-loader").fadeIn(300); 
    $('body').addClass('overflow-hidden'); 
}

function loadingStop() {
    if (!isLoading) return; 
    isLoading = false; 
    $("#global-loader").fadeOut(300, function() {
      $('body').removeClass('overflow-hidden'); 
    });
}

function loadingPaginationStart(){
    clearSelection();
    $('.pagination-loading').show();

}
function loadingPaginationStop(){
  $('.pagination-loading').hide();
}
function formatNumberWithCommas(number) {
  var numberString = number.toString();
  var parts = numberString.split(".");
  var integerPart = parts[0];
  var decimalPart = parts.length > 1 ? "." + parts[1] : "";
  var formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedInteger + decimalPart;
}
var toggleFieldAttributes = (selector, condition, parentClass) => {
  var fields = document.querySelectorAll(selector);
  fields.forEach(function(field) {
      // Ensure we are working with the element itself, not classList
      var reqField = field;

      if (field.tagName === 'SELECT') {
          if (condition) {
              field.removeAttribute('disabled');
          } else {
              field.setAttribute('disabled', 'disabled');
          }
      } else if (field.tagName === 'INPUT') {
          if (field.type === 'file') {
              if (condition) {
                  field.removeAttribute('disabled');
              } else {
                  field.setAttribute('disabled', 'disabled');
              }
          } else {
              if (condition) {
                  field.removeAttribute('readonly');
              } else {
                  field.setAttribute('readonly', 'readonly');
              }
          }
      } else if (field.tagName === 'TEXTAREA') {
          if (condition) {
              field.removeAttribute('readonly');
          } else {
              field.setAttribute('readonly', 'readonly');
          }
      } else {
          var hasEditField = field.querySelector(parentClass);
          if (hasEditField) {
              reqField = hasEditField; // Use the element itself, not its classList
          }

          if (condition) {
              field.classList.remove('d-none');
          } else {
              field.classList.add('d-none');
          }
      }

      // This part works with the field element (not classList anymore)
      if (reqField.classList.contains('required')) {
          if (condition) {
              reqField.setAttribute('required', 'required');
          } else {
              reqField.removeAttribute('required');
          }
      }
  });
};
