var participants_list;
var vertical_dotted_line;
var participant_entry;
var participant_entry_name;
var participant_entry_logo;
var participant_entry_address;
var participant_entry_phone;
var participant_entry_email;
var participant_entry_web;
var participant_entry_desc;
var left_menu;
var search_text;
var not_to_print;
var body;
var print_icon;
var back_icon;
var lang_selected;
var result;


$(document).ready(function(){

  participants_list =         $('.participants_list');
  search_result =			  $('.search_result')
  vertical_dotted_line =      $('.participants_list .vertical_dotted_line');
  participant_entry =         $('.participant_entry');
  participant_entry_name =    $('.participant_entry .name');
  participant_entry_logo =    $('.participant_entry .logo');
  participant_entry_address = $('.participant_entry .address');
  participant_entry_phone =   $('.participant_entry .phone');
  participant_entry_email =   $('.participant_entry .email');
  participant_entry_web =     $('.participant_entry .web');
  participant_entry_desc =    $('.participant_entry .desc');
  left_menu =                 $('.left_menu');
  search_text =               $('.search_text');
  not_to_print =              $(".topbar_1,.topbar_2,.topbar_3,.topbar_4,.lefbar_1,.lefbar_2,.rigbar_1,.rigbar_2,.search_block,.print_icon,.back_icon,.exhibition_logo,.left_menu");
  body =                      $('body');
  print_icon =                $('.print_icon');
  back_icon =                 $(".back_icon");
  radio_lang =                $('.radio_lang');


  $('.search_icon').click( function(){
    $('.search_block').toggleClass('slide_left');
    $('.search_icon').toggleClass('slide_down');
  } );

  $('.exhibition_logo').click( populate_partticipants_list );
  $('.search_button').click(function(){
    result = populate_partticipants_list(false,false,search_text.val());
	if (result.length) {
		search_result.css("display","none");
	} else {
		(lang_selected=="ua") ? search_result.html('На жаль, по вашому запиту нічого не знайдено') : search_result.html('Unfortunately, nothing was found on your request');
		search_result.css("display","");
	}
    $('.search_icon').click();
  });

  print_icon.click(prepare_for_print);
  back_icon.click(function(){
    if( participants_list.css("display") == "none" )
    {
      participants_list.css("display","");
      participant_entry.css("display","none");
	  search_result.css("display","none");
      print_icon.css("cursor","");
      back_icon.css("cursor","");
    }
  });

  $('.lang_ua_submit_button').click(function(){

	lang_selected = "ua";
    comp_data = comp_data.sort(function(a, b){
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });

    populate_partticipants_list();
    populate_categories();

    $('.start_page').css("display","none");

  });

  $('.lang_en_submit_button').click(function(){

	  lang_selected = "en";
      comp_data = comp_data_en;
      comp_cat  = comp_cat_en;


    comp_data = comp_data.sort(function(a, b){
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });

    populate_partticipants_list();
    populate_categories();

    $('.start_page').css("display","none");

  });

});




function populate_partticipants_list(cat, letter, word)
{
  if (typeof cat != "number")
    cat = false;

  if (typeof letter != "string" || letter.length > 1)
    letter = false;

  if (/\d/im.test(letter) && letter)
    letter = "\\d";

  if(letter)
    var first_letter_test = new RegExp('^'+letter, 'im');

  if(typeof word != "string")
    word = false;
  else
    word = word.toLowerCase();

  vertical_dotted_line.html("");

  var i;
  for(i=0;i<comp_data.length;i++)
  {
    if ( comp_data[i]['name'] == "" )
      continue;

    if ( !(comp_data[i]['cat'].indexOf(cat) >= 0) && cat !== false)
      continue;

    if ( !(comp_data[i]['name'].match(first_letter_test) ) && letter)
      continue;

    if ( !((comp_data[i]['name'].toLowerCase().indexOf(word)    >= 0) ||
           (comp_data[i]['address'].toLowerCase().indexOf(word) >= 0) ||
           (comp_data[i]['desc'].toLowerCase().indexOf(word)    >= 0) ) && word )
      continue;

    vertical_dotted_line.append('<a class="participant" onclick="show_participant('+i+')">'+comp_data[i]['name'].substr(0, 33)+(comp_data[i]['name'].length>33?"...":"")+'</a>');
  }

  participants_list.css("display","");
  participant_entry.css("display","none");
  search_result.css("display","none");
  print_icon.css("cursor","");
  back_icon.css("cursor","");
  
  return vertical_dotted_line[0].children;
}

function show_participant(id)
{

  var phones_array = comp_data[id]['phone'].split(",");
  phones_array = phones_array.filter( function(item, pos) { return phones_array.indexOf(item) == pos; } );
  phones_array.splice(4, 10);
  phones_array.splice(2, 0, "<br>");
  phones_array = phones_array.join(" ");

  var email_array = comp_data[id]['email'].replace(/,[^\w]*$/img, "").split(",");
  email_array.splice(2, 10);
  email_array.splice(1, 0, "<br>");
  email_array = email_array.join(" ");

  var web_value = comp_data[id]['web'].replace(/,[^\w]*$/img, "");
  web_value = web_value.replace(/^http:\/\//img, "");
  web_value = '<a href="http://'+web_value+'" target="_blank">'+web_value+'</a>';


  participant_entry_name.html(comp_data[id]['name']+"<br/>");
  participant_entry_logo.html( comp_data[id]['logo']!="" ? '<img src="logo/'+comp_data[id]['logo']+'" />' : ''+"<br/>");
  (comp_data[id]['address'].length > 5) ? participant_entry_address.html("<i class=\"fa fa-map-marker fa-lg\" aria-hidden=\"true\"></i>  "+comp_data[id]['address']+"<br/>") 
										: participant_entry_address.html(comp_data[id]['address']+"<br/>");
  (comp_data[id]['phone']) ? participant_entry_phone.html("<i class=\"fa fa-phone fa-lg\" aria-hidden=\"true\"></i>  "+phones_array+"<br/>") : participant_entry_phone.html(phones_array+"<br/>");
  (comp_data[id]['email']) ? participant_entry_email.html("<i class=\"fa fa-envelope-o fa-lg\" aria-hidden=\"true\"></i>  "+email_array+"<br/>") : participant_entry_email.html(email_array+"<br/>");
  (comp_data[id]['web']) ? participant_entry_web.html("<i class=\"fa fa-globe fa-lg\" aria-hidden=\"true\"></i>  " + web_value) : participant_entry_web.html(web_value);
  participant_entry_desc.html(comp_data[id]['desc']);

  participants_list.css("display","none");
  participant_entry.css("display","");
  print_icon.css("cursor","pointer");
  back_icon.css("cursor","pointer");
}


function populate_categories()
{

  left_menu.html("");
  var i;

  left_menu.append('<a onclick="populate_partticipants_list()">' + ((lang_selected == 'en') ? "EXHIBITORS" : "Учасники") + '</a>');
  for(i=0;i<comp_cat.length;i++)
  {
    left_menu.append('<a onclick="populate_partticipants_list('+comp_cat[i]['id']+')">'+comp_cat[i]['name']+'</a>');
  }
  participants_list.css("display","");
  participant_entry.css("display","none");
  search_result.css("display","none");

}

function prepare_for_print()
{
  if( participant_entry.css("display") == "none")
    return;

  not_to_print.css("display","none");
  participant_entry.css("overflow-y","auto");
  participant_entry.css("position","initial");

  body.css("position","initial");
  body.css("width","auto");
  body.css("height","auto");
  body.css("margin","0");

  //PRINT
  print();

  not_to_print.css("display","");
  participant_entry.css("overflow-y","");
  participant_entry.css("position","");

  body.css("position","");
  body.css("width","");
  body.css("height","");
  body.css("margin","");
}


