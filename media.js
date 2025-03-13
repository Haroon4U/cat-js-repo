
	/*
	|--------------------------------------------------------------------------
	| Media Manager
	|--------------------------------------------------------------------------
	*/

    // // Configuration
    $(document).off('.do-file_configuration').on('click', '.do-file_configuration', function(e){
        e.preventDefault();
        var url = root_url + '/file/configuration';
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        c_view_controller(url, 'POST', {}).then(() => {
        loadingStop();
        });
    });

    // Document Type
    $(document).off('click','.do-document_type').on('click', '.do-document_type', function(e){
        e.preventDefault();
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        var url = root_url + '/file/document/type';
        c_view_controller(url, 'POST', {}).then(() => {
        loadingStop();
        });
    });
    $(document).off('click', '.create-document_type').on('click', '.create-document_type', function(e) {
        var url = root_url + '/file/document/create';
        edit_view_content_popup(url, "Post", {});
    });
    $(document).off('click', '.edit-document_type').on('click', '.edit-document_type', function(e) {
        e.preventDefault();
        try {
        setTimeout(function() {
            var currentRowId = getSelectedRowIds(table, $(this));
            if(!currentRowId) return;
            var currentRowIds = getCurrentPageId(table);
            var postData = { 
                'root_id': currentRowId,
                'rowsIds': currentRowIds
            };
            var url = root_url + '/file/document/type/create';
            edit_view_content_popup(url, 'post', postData);
        }, 100);
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('submit', '#document_type-postData').on('submit', '#document_type-postData', function(event) {
        event.preventDefault();
        let form = this;
        let postData = new FormData(this);
        $(form).find(':submit').attr('disabled','disabled');
        var url = root_url + '/file/document/type/store';
        sendRequestToServer(postData, url, "POST")
        .then((data) => {
            if (data.success) {
                reloadTablePreservingState();
            }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(form).find(':submit').removeAttr('disabled');
        });
    });
    $(document).off('click', '.status-document_type').on('click', '.status-document_type', function(event) {
        event.preventDefault();
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var status = $(this).data('status');
        var url = root_url + '/file/document/type/status';
        var formData = {
            ids: currentRowId,
            status: status
        };
        $.post(url, formData, function(response) {
            loadingStop();
            if (response.success) {
                reloadTablePreservingState();
                dialogBoxPopup.modal('hide');
            } else {
                errorToast(response.message);
            }
        }).fail(function(xhr) {
            loadingStop();
            handleAjaxError(xhr);
        });
    });
    $(document).off('click', '.delete-document_type').on('click', '.delete-document_type', function(event) {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete the selected rows?")) {
            return;
        }
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var url = root_url + '/file/document/type/destroy';
        var formData = {
        ids: currentRowId,
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            reloadTablePreservingState();
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    var DocumentTypeNextPrevious = {
        context: {
        isFormDirty: false,
        rowsIds: [],
        currentId: null, 
        endpoint: 'file/document/type/create',
        viewContentPopup: c_view_controller
        },
        init: () => {
        NextPreviousNavigator.init(DocumentTypeNextPrevious.context);
        },
        updateContext: (newRowsIds, newCurrentId) => {
        DocumentTypeNextPrevious.context.rowsIds = newRowsIds;
        DocumentTypeNextPrevious.context.currentId = newCurrentId;
        NextPreviousNavigator.updateNavigationButtons(DocumentTypeNextPrevious.context);
        }
    };
    // // Media Documents
    $(document).off('click','.do-document').on('click', '.do-document', function(e){
        e.preventDefault();
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        var url = root_url + '/file/media_document';
        c_view_controller(url, 'POST', {}).then(() => {
            loadingStop();
        });
    });
    $(document).off('click','.download-media_document').on('click','.download-media_document', function(e) {
        e.preventDefault();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        mediaDocumentDownload(currentRowId);
    });
    $(document).off('click', '.delete-document').on('click', '.delete-document', function(event) {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete the selected rows?")) {
            return;
        }
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var url = root_url + '/file/media_document/destroy';
        var formData = {
        ids: currentRowId,
        };
        $.post(url, formData, function(response) {
            loadingStop();
            if (response.success) {
                reloadTablePreservingState();
            } else {
                errorToast(response.message);
            }
        }).fail(function(xhr) {
    
            handleAjaxError(xhr);
        });
    });
    function mediaViewer(document_id) {
        var url = root_url + '/file/media_document/view';
        loadingStart();
        var postData = { 'root_id': document_id };
        $.ajax({
            method: "POST",
            url: url,
            data: postData,
            success: function (data) {
                loadingStop();
                if (data.error) {
                    errorToast(data);
                    return;
                }
  
                var fileUrl = data.fileUrl;
                var fileType = data.fileType;
                var defaultUrl = data.defaultUrl;
                var documentName = data.documentName;
                var documentType = data.documentType;


  
                if (fileType === 'pdf') {
                  window.open(fileUrl, '_blank');
              } else {
                var image = new Image();

                    image.src = fileUrl;
                    image.alt = documentName;

                    var viewer = new Viewer(image, {
                        title:true,
                        hidden: function () {
                            viewer.destroy();
                        },
                        toolbar: {
                                oneToOne: true,
                                zoomIn: true,
                                zoomOut: true,
                                download: function() {
                                    const a = document.createElement('a');

                                    a.href = viewer.image.src;
                                    a.download = viewer.image.alt;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                },
                                },
                    });
                    // image.click();
                    viewer.show();
                }

            },
            error: function (xhr) {
                loadingStop();
                handleAjaxError(xhr);
            }
        });
    }
    function mediaDocumentDownload(document_id) {
        // swal({
        //     title: 'Downloading...',
        //     text: 'Please wait while your file is being prepared.',
        //     showCancelButton: false,
        //     showConfirmButton: false,
        //     closeOnClickOutside: false,
        //     closeOnEsc: false,
        // });
    
            var form = $('<form>');
            form.attr('method', 'post');
            form.attr('action', '/file/media_document/download');
            form.attr('target', '_blank');
            form.append($('<input>').attr('type', 'hidden').attr('name', 'selectedId').val(document_id));
            $('body').append(form);
            form.submit();
            form.remove();
    }
    