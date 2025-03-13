
	/*
	|--------------------------------------------------------------------------
	| Fleet
	|--------------------------------------------------------------------------
	*/
    // // Configuration
    $(document).off('.do-fleet_configuration').on('click', '.do-fleet_configuration', function(e){
        e.preventDefault();
        var url = root_url + '/fleet/configuration';
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        c_view_controller(url, 'POST', {}).then(() => {
        loadingStop();
        });
    });

    // Vehicle Model
    $(document).off('click','.do-vehicle_model').on('click', '.do-vehicle_model', function(e){
        e.preventDefault();
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        var url = root_url + '/vehicle/model';
        c_view_controller(url, 'POST', {}).then(() => {
        loadingStop();
        });
    });
    $(document).off('click', '.create-vehicle_model').on('click', '.create-vehicle_model', function(e) {
        var url = root_url + '/vehicle/model/create';
        edit_view_content_popup(url, "Post", {});
    });
    $(document).off('click', '.edit-vehicle_model').on('click', '.edit-vehicle_model', function(e) {
        e.preventDefault();
        try {
        setTimeout(function() {
            var currentRowId = getSelectedRowIds(table, $(this));
            if(!currentRowId) return;
            var postData = { 
                'root_id': currentRowId,
            };
            var url = root_url + '/vehicle/model/create';
            edit_view_content_popup(url, 'post', postData);
        }, 100);
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('submit', '#vehicle_model-postData').on('submit', '#vehicle_model-postData', function(event) {
        event.preventDefault();
        let form = this;
        let postData = new FormData(this);
        $(form).find(':submit').attr('disabled','disabled');
        var url = root_url + '/vehicle/model/store';
        var method = "POST";
        sendRequestToServer(postData, url, method)
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
    $(document).off('click', '.status-vehicle_model').on('click', '.status-vehicle_model', function(event) {
        event.preventDefault();
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var status = $(this).data('status');
        var url = root_url + '/vehicle/model/status';
        var formData = {
            ids: currentRowId,
            status: status
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            reloadTablePreservingState();
            // dialogBoxPopup.modal('hide');
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    $(document).off('click', '.delete-vehicle_model').on('click', '.delete-vehicle_model', function(event) {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete the selected rows?")) {
            return;
        }
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var url = root_url + '/vehicle/model/destroy';
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


    // // Vehicle Detail
    $(document).off('click','.do-vehicle').on('click', '.do-vehicle', function(e){
        e.preventDefault();
        var url = root_url + 'vehicle';
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        c_view_controller(url, 'POST', {}).then(() => {
        loadingStop();
        });
    });
    $(document).off('click', '.create-vehicle').on('click', '.create-vehicle', function(e){
        try{
        var url = root_url + '/vehicle/create';
        edit_view_content_popup(url, 'post', {});
        }catch(error){
            handleAjaxError(error);
        }
    });
    $(document).off('click', '.edit-vehicle').on('click', '.edit-vehicle', function(e) {
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
            var url = root_url + '/vehicle/create';
            edit_view_content_popup(url, 'post', postData);
        }, 100);
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('click', '.status-vehicle').on('click', '.status-vehicle', function(event) {
        event.preventDefault();
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var status = $(this).data('status');
        var url = root_url + '/vehicle/status';
        var formData = {
            ids: currentRowId,
            status: status
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            reloadTablePreservingState();
            // dialogBoxPopup.modal('hide');
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    $(document).off('click', '.delete-vehicle').on('click', '.delete-vehicle', function(event) {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete the selected rows?")) {
            return;
        }
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var url = root_url + '/vehicle/destroy';
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
    $(document).off('submit', '#vehicle-postData').on('submit', '#vehicle-postData', function(event) {
        event.preventDefault();
        loadingStart();

        let form = this;
        let postData = new FormData(this);
        $(form).attr('disabled','disabled');
        var url = root_url + '/vehicle/store';
        var method = "POST";
        sendRequestToServer(postData, url, method)
        .then((data) => {
            if (data.success) {
                reloadTablePreservingState();
            }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(form).removeAttr('disabled');
            loadingStop();
        });
    });
    $(document).off('click', '.export-vehicle').on('click', '.export-vehicle', function(event){
        event.preventDefault();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var form = $('<form>');
        form.attr('method', 'post');
        form.attr('action', '/vehicle/export');
        form.attr('target', '_blank');
        form.append($('<input>').attr('type', 'hidden').attr('name', 'selectedRow').val(currentRowId));
        $('body').append(form);
        form.submit();
        form.remove();
    });
    var VehicleNextPrevious = {
        context: {
        isFormDirty: false,
        rowsIds: [],
        currentId: null, 
        endpoint: 'vehicle/create',
        viewContentPopup: edit_view_content_popup
        },
        init: () => {
        NextPreviousNavigator.init(VehicleNextPrevious.context);
        },
        updateContext: (newRowsIds, newCurrentId) => {
            VehicleNextPrevious.context.rowsIds = newRowsIds;
            VehicleNextPrevious.context.currentId = newCurrentId;
            NextPreviousNavigator.updateNavigationButtons(VehicleNextPrevious.context);
        }
    };

    // Personal Security Pass
    $(document).off('click','.do-vehicle_passes').on('click', '.do-vehicle_passes', function(e){
        e.preventDefault();
        var url = root_url + '/vehicle/passes';
        $('#sidebar-menu').find('.active').removeClass('active');
        $(this).addClass('active');
        $('.main-wrapper').removeClass('slide-nav');
        $('.sidebar-overlay').removeClass('opened');
        page_content(url, 'POST', {});
    });
    $(document).off('click', '.create-vehicle_passes').on('click', '.create-vehicle_passes', function(e){
        try{
        var url = root_url + '/vehicle/passes/create';
        var method = "post";
        edit_view_content_popup(url, method, {});
        }catch(error){
        errorToast(error);
        }
    });
    $(document).off('click', '.edit-vehicle_passes').on('click', '.edit-vehicle_passes', function(e) {
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
            var url = root_url + '/vehicle/passes/create';
            edit_view_content_popup(url, 'post', postData);
        }, 60);
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('submit', '#vehicle_passes-postData').on('submit', '#vehicle_passes-postData', function(event) {
        event.preventDefault();
        loadingStart();
        
        let self = this;
        let formId = $(self).attr('id');
        let buttonSubmit = $(`button[form="${formId}"]`);
        $(buttonSubmit).attr('disabled', 'disabled');
        let postData = new FormData(self);
        $(self).attr('disabled', 'disabled');
        var url = root_url + '/vehicle/passes/store';
        sendRequestToServer(postData, url, 'Post')
        .then((data) => {
            if (data.success) {
            dialogBoxPopup.find('.modal-title').html(data.title);
            dialogBoxPopup.find('.modal-sub-title').html(data.sub_title);
            $('input[name="vehicle_passes_id"]').val(data.query.id);
            get_vehicle_passes_record(data.query.id);
            updateComposerField(data.module, data.query.id);
            getMailContent();
            reloadTablePreservingState();
            }
        }).catch((error) => {
            handleAjaxError(error);
        }).finally(() => {
            $(self).removeAttr('disabled');
            $(buttonSubmit).removeAttr('disabled');
            loadingStop();
        });
    });

    var VehicleSecurityPassNextPrevious = {
        context: {
        isFormDirty: false,
        rowsIds: [],
        currentId: null, 
        endpoint: 'vehicle/passes/create',
        viewContentPopup: edit_view_content_popup
        },
        init: () => {
        NextPreviousNavigator.init(VehicleSecurityPassNextPrevious.context);
        },
        updateContext: (newRowsIds, newCurrentId) => {
            VehicleSecurityPassNextPrevious.context.rowsIds = newRowsIds;
            VehicleSecurityPassNextPrevious.context.currentId = newCurrentId;
        NextPreviousNavigator.updateNavigationButtons(VehicleSecurityPassNextPrevious.context);
        }
    };
    $(document).off('submit','#search-vehicle_passes').on('submit','#search-vehicle_passes', function(e) {
        e.preventDefault();
        loadingStart();
        const formData = {
            app_module: 'search',
            search_record: $('input[name="search_record"]').val(),
            search_type: $('input[name="searchType"]:checked').val(),
            from_date: $('input[name="from_date"]').val(),
            to_date: $('input[name="to_date"]').val(),
            status: $('input[name="status"]:checked').map(function() {
                return $(this).val();
            }).get().join(','),
            document_status: $('input[name="document_status"]:checked').map(function() {
                return $(this).val();
            }).get().join(','),
            duplicate_status: $('input[name="duplicate_status"]:checked').map(function() {
            return $(this).val();
        }).get().join(','),
        };
        $.post(root_url + '/vehicle/passes/filter', formData)
        .done(function(res) {
            if (res.error) {
                errorToast(res.message);
            } else {
                let breadcrumb =`
                    <li class="breadcrumb-item"><a href="/">Dashboard</a></li>
                    <li class="breadcrumb-item do-vehicle_passes active"><a href="javascript:void(0);">Vehicle Security Passes</a></li>
                `;
                if (formData.search_record.trim()) {
                    breadcrumb += `<li class="breadcrumb-item active">${formData.search_record}</li>`;
                }
                if (['submission_date','receiving_date','cancellation_date', 'expiry_date','created_date'].includes(formData.search_type) && formData.from_date && formData.to_date) {
                    breadcrumb += `<li class="breadcrumb-item active">From: ${formData.from_date} to ${formData.to_date}</li>`;
                }


                $('.breadcrumb').html(breadcrumb);
                $('#table_list').html(res.dataTable);
            }
        })
        .fail(handleAjaxError)
        .always(loadingStop);
    });
    $(document).off('click', '.delete-vehicle_passes').on('click', '.delete-vehicle_passes', function(event) {
        event.preventDefault();
        if (!confirm("Are you sure you want to delete the selected rows?")) {
            return;
        }
        loadingStart();
        var currentRowId = getSelectedRowIds(table, $(this));
        if(!currentRowId) return;
        var url = root_url + '/vehicle/passes/destroy';
        var formData = {
        ids: currentRowId,
        };
        $.post(url, formData, function(response) {
        loadingStop();
        if (response.success) {
            successToast(response.message);
            reloadTablePreservingState();
        } else {
            errorToast(response.message);
        }
        }).fail(function(xhr) {
        loadingStop();
            handleAjaxError(xhr);
        });
    });
    $(document).off('click', '.view_document-vehicle_passes').on('click', '.view_document-vehicle_passes', function(e) {
        e.preventDefault();
        var self = this;
        try {
            setTimeout(function() {
            var currentRowId = (typeof table !== 'undefined') ? getSelectedRowIds(table, $(self)) : $(self).data('id');
            if (!currentRowId) return; 
            var form = $('<form>');
                form.attr('method', 'post');
                form.attr('action', '/vehicle/passes/document_view');
                form.attr('target', '_blank');
                form.append($('<input>').attr('type', 'hidden').attr('name', 'selectedId').val(currentRowId));
                $('body').append(form);
                form.submit();
                form.remove();
        }, 60);
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('click', '.download-vehicle_passes').on('click', '.download-vehicle_passes', function(e) {
        e.preventDefault();
        var self = this;
        try {
        var currentRowId = (typeof table !== 'undefined') ? getSelectedRowIds(table, $(self)) : $(self).data('id');
        if (!currentRowId) return; 
        var form = $('<form>');
            form.attr('method', 'post');
            form.attr('action', '/vehicle/passes/download');
            form.attr('target', '_blank');
            form.append($('<input>').attr('type', 'hidden').attr('name', 'selectedId').val(currentRowId));
            $('body').append(form);
            form.submit();
            form.remove();
        } catch (error) {
        handleAjaxError(error);
        }
    });
    $(document).off('click', '.export-vehicle_passes').on('click', '.export-vehicle_passes', function(event){
        event.preventDefault();
        var selectedIds = [];
            var selectedIds = table.rows({ selected: true }).data().pluck('id').toArray();
        if (selectedIds.length > 0) {
            var idsString = selectedIds.join(',');
            var form = $('<form>');
            form.attr('method', 'post');
            form.attr('action', '/vehicle/passes/export');
            form.attr('target', '_blank');
            form.append($('<input>').attr('type', 'hidden').attr('name', 'selectedRow').val(idsString));
            $('body').append(form);
            form.submit();
            form.remove();
        } else {
            errorToast('No records selected for Export');
        }
    });
    function vehiclePassExpiryList(t,e){
        var url= root_url + '/vehicle/passes/view/expiry'
        var postData = {
            'filter' : t,
            'description' : e, 
        };
        edit_view_content_popup(url,'post', postData);
    }