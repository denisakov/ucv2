(function () {
	// Variable to hold request
	var request;

	// Bind to the submit event of our form
	function formSubmit(event) {

		// Abort any pending request
		if (request) {
			request.abort();
		}
		// setup some local variables
		var $form = $('#uc_generator');

		// Let's select and cache all the fields
		var $inputs = $form.find("input, select, button, textarea");

		// Serialize the data in the form
		var serializedData = $form.serialize();

		// Let's disable the inputs for the duration of the Ajax request.
		// Note: we disable elements AFTER the form data has been serialized.
		// Disabled form elements will not be serialized.
		$inputs.prop("disabled", true);

		// Fire off the request to /form.php
		request = $.ajax({
			url: "https://script.google.com/a/macros/userconversion.com/s/AKfycbw3Sp6Ivvh0ROz9HO_VFfuiis0KnfsNQPQtwhi3HtcLNV_emGdJ/exec",
			method: "POST",
			dataType: 'jsonp',
			data: serializedData
		});

		// Callback handler that will be called on success
		request.done(function (response, textStatus, jqXHR) {
			// Log a message to the console
		});

		// Callback handler that will be called on failure
		request.fail(function (jqXHR, textStatus, errorThrown) {
			// Log the error to the console

		});

		// Callback handler that will be called regardless
		// if the request failed or succeeded
		request.always(function (response) {
			// Reenable the inputs
			$inputs.prop("disabled", false);
			console.log(response.result + ". Row " + response.row + " was created.");
		});

		// Prevent default posting of form
		if (event) event.preventDefault();
	};

	// Google Sheets Helper Functions
	var jsonp = function (url) {
		var script = window.document.createElement('script');
		script.async = true;
		script.src = url;
		script.onerror = function () {
			alert('Can not access JSONP file.');
		};
		var done = false;
		script.onload = script.onreadystatechange = function () {
			if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
				done = true;
				script.onload = script.onreadystatechange = null;
				if (script.parentNode) {
					return script.parentNode.removeChild(script);
				}
			}
		};
		window.document.getElementsByTagName('head')[0].appendChild(script);
	};

	var parse = function (data) {
		if (data.status == 'error'){
			console.error(data.errors[0].detailed_message);
		}
		var column_length = data.table.cols.length;
		if (!column_length || !data.table.rows.length) {
			return false;
		}
		var columns = [],
			result = [],
			row_length,
			value;
		for (var column_idx in data.table.cols) {
			columns.push(data.table.cols[column_idx].label);
		}
		for (var rows_idx in data.table.rows) {
			row_length = data.table.rows[rows_idx]['c'].length;
			if (column_length != row_length) {
				// Houston, we have a problem!
				return false;
			}
			for (var row_idx in data.table.rows[rows_idx]['c']) {
				if (!result[rows_idx]) {
					result[rows_idx] = {};
				}
				value = !!data.table.rows[rows_idx]['c'][row_idx].v ? data.table.rows[rows_idx]['c'][row_idx].v : null;
				result[rows_idx][columns[row_idx]] = value;
			}
		}
		return result;
	};

	var query = function (sql, callback) {
		var url = 'https://spreadsheets.google.com/a/google.com/tq?',
			params = {
				key: '1uRQHJbmXMEM9eN5qKI0epUoHW0gwAV5WT9MqkUMj2Og',
				tq: encodeURIComponent(sql),
				tqx: 'responseHandler:' + callback
			},
			qs = [];
		for (var key in params) {
			qs.push(key + '=' + params[key]);
		}
		url += qs.join('&');
		return jsonp(url); // Call JSONP helper function
	};


	$('.uc-typeButton').each(function () {
        var value = $(this).val();
        $(this).click(function () {
		$(this).find('.uctopradio').prop('checked',true);
		var name = $(this).attr('name');
            $('#yesSprint2')[0].checked = false;
            $('#yesSprint1')[0].checked = false;
            $('#noSprint1')[0].checked = false;
            $('#noSprint2')[0].checked = false;
            $('#uc_generator .documentSelect').val($(this).attr('name')).trigger('change');

            if ($('#submitBtn').hasClass('hidden')) {
                $('#submitBtn').removeClass('hidden');
            }
            //$('#testID')[0].parentNode.addClass('input--filled');

        });

	});
	$('#uc_generator .clientSelect').change(function () {
		var selectedOption = $('#uc_generator .clientSelect').val();
		if (selectedOption != "-- Select An Option --") {
			query("select D", 'getId');
		}
	});
	//Show and Hide the Relevant Forms
	// $('#uc_generator .documentSelect').change(function () {
	// 	var selectedOption = $('#uc_generator .documentSelect').val();
	// 	if (selectedOption === "Hypothesis Document") {
	// 		$('.hypothesis_form').slideDown('200').addClass('active');
	// 		$('.idea_form').slideUp('200').removeClass('active');
	// 		$('.half_sprint_form').slideUp('200').removeClass('active');
	// 		$('.insight_form').slideUp('200').removeClass('active');
	// 		$('.sprint_form').slideUp('200').removeClass('active');
	// 		query("select D", 'getId');
	// 	} else if (selectedOption === "Test Idea") {
	// 		$('.idea_form').slideDown('200').addClass('active');
	// 		$('.hypothesis_form').slideUp('200').removeClass('active');
	// 		$('.insight_form').slideUp('200').removeClass('active');
	// 		$('.sprint_form').slideUp('200').removeClass('active');
	// 		$('.half_sprint_form').slideUp('200').removeClass('active');
	// 	} else if (selectedOption === "Client Insight") {
	// 		$('.insight_form').slideDown('200').addClass('active');
	// 		$('.hypothesis_form').slideUp('200').removeClass('active');
	// 		$('.idea_form').slideUp('200').removeClass('active');
	// 		$('.sprint_form').slideUp('200').removeClass('active');
	// 		$('.half_sprint_form').slideUp('200').removeClass('active');
	// 	} else if (selectedOption === "Experiment Sprint") {
	// 		$('.sprint_form').slideDown('200').addClass('active');
	// 		$('.hypothesis_form').slideUp('200').removeClass('active');
	// 		$('.idea_form').slideUp('200').removeClass('active');
	// 		$('.insight_form').slideUp('200').removeClass('active');
	// 		$('.half_sprint_form').slideUp('200').removeClass('active');
	// 	}
	// });



	//form animation event listener
	if (!String.prototype.trim) {
		(function () {
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function () {
				return this.replace(rtrim, '');
			};
		})();
	}

	window.onload = function () {
		var inputFields = document.querySelectorAll('.input__field');

		inputFields.forEach(function (inputEl) {
			if (inputEl.value.trim() !== '') {
				inputEl.parentNode.classList.add('input--filled');
			}
			inputEl.addEventListener('focus', onInputFocus);
			inputEl.addEventListener('blur', onInputBlur);
		});
	};

	/**
	 * Handle input's focus event.
	 * @param {event} e The event to handle
	 */
	function onInputFocus(e) {
		e.target.parentNode.classList.add('input--filled');
	}

	/**
	 * Handle input's blur event.
	 * @param {event} e The event to handle
	 */
	function onInputBlur(e) {
		if (e.target.value.trim() === '') {
			e.target.parentNode.classList.remove('input--filled');
		}
	}

	//Show Sprint Forms
	// $('#yesSprint1').click(function () {
	// 	$('.half_sprint_form').slideDown('200').addClass('active');
	// });


	// $('#yesSprint2').click(function () {
	// 	$('.half_sprint_form').slideDown('200').addClass('active');
	// });

	// $('#noSprint1').click(function () {
	// 	$('.half_sprint_form').slideUp('200').removeClass('active');
	// });


	// $('#noSprint2').click(function () {
	// 	$('.half_sprint_form').slideUp('200').removeClass('active');
	// });

	//document.getElementById("uc_generator").reset();

	// All client data
	var clientData = {
		'Agency Central': {
			prefix: 'AC',
			colId: 'D',
			boardId: '5906e420f3a1b5086382a490',
			listIds: {
				'Hypothesis Document': '5906e420f3a1b5086382a494',
				'Test Idea': '5906e420f3a1b5086382a493',
				'Client Insight': '5906e420f3a1b5086382a491'
			}
		},
		'Biscuiteers': {
			prefix: 'BI',
			colId: 'D',
			boardId: '59a88569e1016901c0092d82',
			listIds: {
				'Hypothesis Document': '59a88569e1016901c0092d88',
				'Test Idea': '59a88569e1016901c0092d86',
				'Client Insight': '59a88569e1016901c0092d85'
			}
		},
		'CurrentBody.com': {
			prefix: 'CB',
			colId: 'D',
			boardId: '55e01ee1955d58ca1358cc63',
			listIds: {
				'Hypothesis Document': '58492498d28aa56d3b10c7fd',
				'Test Idea': '55edd6b3a3ee51f0d4f2042a',
				'Client Insight': '58e2516c9b2b7311701e0f65'
			}
		},

		'In The Style': {
			prefix: 'IT',
			colId: 'D',
			boardId: '59402d04865d955bc5bd78a3',
			listIds: {
				'Hypothesis Document': '59402d04865d955bc5bd78a9',
				'Test Idea': '59402d04865d955bc5bd78a7',
				'Client Insight': '59402d04865d955bc5bd78a6'
			}
		},
		'Mamas & Papas': {
			prefix: 'MP',
			colId: 'D',
			boardId: '57f7abe044ac7abe391dc181',
			listIds: {
				'Hypothesis Document': '581afc61a6d37ac1f71c8e23',
				'Test Idea': '58048785d1e555e8a3bd4f46',
				'Client Insight': '58ff6d846b638b4a47fdbba3'
			}
		},
		'Merchoid': {
			prefix: 'ME',
			colId: 'D',
			boardId: '561668d9af8166f38e581c38',
			listIds: {
				'Hypothesis Document': '58275cc19999dd7339c70f1a',
				'Test Idea': '561668d9af8166f38e581c3d',
				'Client Insight': '590773a1a203842a0a72477b'
			}
		},
		'National Holidays': {
			prefix: 'NH',
			colId: 'D',
			boardId: '59b2abfa2bc0ee9833921360',
			listIds: {
				'Hypothesis Document': '59b2abfa2bc0ee9833921366',
				'Test Idea': '59b2abfa2bc0ee9833921364',
				'Client Insight': '59b2abfa2bc0ee9833921363'
			}
		},
		'Protec Direct': {
			prefix: 'PD',
			colId: 'D',
			boardId: '597a159e22addb53d82dbed8',
			listIds: {
				'Hypothesis Document': '597a159e22addb53d82dbede',
				'Test Idea': '597a159e22addb53d82dbedc',
				'Client Insight': '597a159e22addb53d82dbedb'
			}
		},

		'Red Cross Training': {
			prefix: 'RC',
			colId: 'D',
			boardId: '58bfe0d039fbf3767dfa7c74',
			listIds: {
				'Hypothesis Document': '58bfe0d039fbf3767dfa7c77',
				'Test Idea': '58bfe0d039fbf3767dfa7c76',
				'Client Insight': '58e8a9250847c82477ee6aa2'
			}
		},
		'Salons Direct': {
			prefix: 'SD',
			colId: 'D',
			boardId: '585c80bcb8ad0c98f00d2af8',
			listIds: {
				'Hypothesis Document': '585c80da6ff11dcf1e408913',
				'Test Idea': '585c80cbf71c88463409181d',
				'Client Insight': '58f5e5db56bfadbd30a1981e'
			}
		},
		'Soak & Sleep': {
			prefix: 'SO',
			colId: 'D',
			boardId: '59074d9d356212551befb036',
			listIds: {
				'Hypothesis Document': '59074d9d356212551befb03a',
				'Test Idea': '59074d9d356212551befb039',
				'Client Insight': '59074d9d356212551befb037'
			}
		},

		'Technogym': {
			prefix: 'TG',
			colId: 'D',
			boardId: '595a0936410a8716ca62e06b',
			listIds: {
				'Hypothesis Document': '595a097830575e396c287c5c',
				'Test Idea': '595a095f853628d8234df5d8',
				'Client Insight': '595a095acb4f9ae08c413f28'
			}
		},
		'Travis Perkins': {
			prefix: 'TP',
			colId: 'D',
			boardId: '58d0f0a305ce7f0715d7cda1',
			listIds: {
				'Hypothesis Document': '58d0f0a305ce7f0715d7cda4',
				'Test Idea': '58d0f0a305ce7f0715d7cda3',
				'Client Insight': '58f67ec53e632c452395e041'
			}
		},
		'Wolf & Badger': {
			prefix: 'WB',
			colId: 'D',
			boardId: '57357af07c6ddfe1e3d59822',
			listIds: {
				'Hypothesis Document': '5756cabb535e401a068c6def',
				'Test Idea': '5757dcc5671127c31081aa11',
				'Client Insight': '59076efc5087c251e65af381'
			}
		},
		'Wooden Blinds Direct': {
			prefix: 'WO',
			colId: 'D',
			boardId: '59074cd57d56688f67752eb1',
			listIds: {
				'Hypothesis Document': '59074cd57d56688f67752eb5',
				'Test Idea': '59074cd57d56688f67752eb4',
				'Client Insight': '59074cd57d56688f67752eb2'
			}
		}
	};



	/* thisClientData will be populated when user has selected both a document
	type and client from the dropdowns.
	@example:
	{
		name: 'Agency Central',
		data: {
			prefix: 'AC',
			colId: 'BI',
			boardId: '0000000042',
			listIds: {
				'Hypothesis Document': '0000000000',
				'Test Idea': '0000000001',
				'Client Insight': '0000000002'
			},
			testId: '002'
		}
	}
	*/
	var thisClientData = {};


	window.getId = function (data) {
		data = parse(data);
		var newId;
		var clientPrefix = thisClientData.data.prefix;

		/* loop backwards through array and find last entry with a number.
		add 1 to this number to generate ID for this test */
		for (var i = data.length; i >= 0; i--) {
			var idObj = data[i];
			/* if this row is an object containing a non-empty string, 
			extract the number and increment on it */
			if (typeof idObj === 'object') {
				var id = idObj["testID"] || idObj[""];
				if (id && id !== 'undefined') {
					/* Data will return all IDs for all clients, so make sure we only 
					increment on the last ID starting with this client prefix. */
					var idPrefix = id.match(/\w{2}/);
					if (idPrefix) idPrefix = idPrefix[0];

					if (idPrefix && idPrefix === clientPrefix) {
						var num = id.match(/\d+/);
						if (num) {
							num++;
							// prefix number with zeros if necessary
							var prefix = (function () {
								var digitLength = num.toString().length;;
								if (digitLength === 1) {
									return '00';
								} else if (digitLength === 2) {
									return '0';
								}
							})();

							if (prefix) num = prefix + num.toString();
							newId = thisClientData.data.prefix + num;
							break;
						}
					}
				}
			}

			if (i === 0) newId = clientPrefix + '001';
		}

		//$('#showTestId').html(newId);
		// Update hidden input to send to Google Sheets on submit
		$('#testID').val(newId);
		//$('#testerId').val(newId);
		// $('#testID').attr("placeholder",newId);
	};

	// $('#testID').focus(function (e) {
	// 	//console.log(thisClientData);
	// 	e.preventDefault();
	// 	if (thisClientData && thisClientData.data && thisClientData.data.colId) {
	// 		//getTestId();
	// 		 query("select " + thisClientData.data.colId, 'getId');
	// 	} else {
	// 		console.error('Failed to get ID - No client data available');
	// 	}
	// });
	// $('#getTestId').click(function (e) {
	// 	//console.log(thisClientData);
	// 	e.preventDefault();
	// 	if (thisClientData && thisClientData.data && thisClientData.data.colId) {
	// 		//getTestId();
	// 		 query("select " + thisClientData.data.colId, 'getId');
	// 	} else {
	// 		console.error('Failed to get ID - No client data available');
	// 	}
	// });

	var updateThisClientData = function () {
		//var docType = $('#docType').val();
		var client = $('#clientName1').val();
		if (client) {
			thisClientData.name = client;
			thisClientData.data = clientData[client];
			//thisClientData.docType = docType;
			thisClientData.prefix = clientData[client].prefix;
			// $('#testID').value = clientData[client].prefix;
			// console.log('Prefix assiged: ' + $('#testID').val());

			// Show generate ID button if hypothesis document
			// if (docType === 'Hypothesis Document') {
			// 	$('#getTestId').show();
			// } else {
			// 	$('#getTestId').hide();
			// }
		}
	};

	// On change, if both inputs have been selected, update hidden inputs
	$('#clientName1').change(updateThisClientData);

	function clearForm() {
		$('#uc_generator')[0].reset();
		$('.hypothesis_form').removeClass('active');
		$('.idea_form').removeClass('active');
		$('.half_sprint_form').removeClass('active');
		$('.insight_form').removeClass('active');
		$('.sprint_form').removeClass('active');
		$('#submitBtn')[0].disabled;
		$('#submitBtn').prop('disabled', false);
		$('#submitBtn').addClass('hidden');
		$('.uc-typeButton').removeClass('active');
		$('.second_section').slideUp('200');
		$('#yesSprint2')[0].checked = false;
		$('#yesSprint1')[0].checked = false;
		$('#noSprint1')[0].checked = false;
		$('#noSprint2')[0].checked = false;

		var $filled = $('.input--filled');
		if ($filled.length) {
			$filled.removeClass('input--filled');
		}
	}

	$('#uc_generator').submit(function (e) {
		e.preventDefault();
		//console.log('The button is clicked');
		// update hidden inputs
		var docType = thisClientData.docType;
		var listId = thisClientData.data.listIds[docType];
		var boardId = thisClientData.data.boardId;
		var prefix = thisClientData.prefix;
		$('#listID').val(listId);
		$('#boardID').val(boardId);
		$('#prefix').val(prefix);

		/* If Hypothesis Document make sure generated ID exists and selected client id matches generated ID */
		// if (thisClientData.docType === 'Hypothesis Document') {
		// 	var selectedClientID = thisClientData.data.prefix;
		// 	var generatedID = $('#showTestId').text();
		// 	if (!generatedID) {
		// 		alert('Please generate an ID before submitting');
		// 		return false;
		// 	} else if (generatedID && generatedID.match(/\w{2}/)[0] !== selectedClientID) {
		// 		alert('Please generate a new ID for this client before submitting');
		// 		return false;
		// 	}
		// }

		formSubmit();

		$("#submitBtn").prop('disabled', true);

		setTimeout(function () {

			// var r = confirm("Form Submitted. You can now close the window or select \"OK\" to create a new form");
			// if (r == true) {
				clearForm();

			// }

		}, 500)
	});

})();