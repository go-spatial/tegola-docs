$(()=>{
	$('table').addClass('table table-bordered table-striped');
	$('thead').addClass('thead-dark');

	$('#TableOfContents').addClass('navbar');
	$('#TableOfContents ul').addClass('nav flex-column');
	$('#TableOfContents ul li').addClass('nav-item');
	$('#TableOfContents ul li a').addClass('nav-link');

	var $spy = $('#TableOfContents ul li').first();
	var $scrollspy = $('body').scrollspy({
		target:$spy,
		offset:40
	});

	$('.content img').addClass('img-fluid');
});