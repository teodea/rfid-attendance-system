function getSemesterList() {
  const academicYear = $('#academic-year').val();
  $.ajax({
    url: '/get-semester-list?academicYear=' + academicYear,
    type: 'GET',
    success: function(response) {
      $('#semester').empty();
      $.each(response, function(index, value) {
        $('#semester').append('<option value="' + value + '">' + value + '</option>');
      });
    }
  });
}

function renderCalendar() {
  
}