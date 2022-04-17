const socket = io();
//elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput= $messageForm.querySelector('input');
const $messageFormButton= $messageForm.querySelector('button');
const $locationButton= document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

//tempplates
const tempplates = document.querySelector('#message-tempplate').innerHTML;
const locationtempplates = document.querySelector('#location-tempplate').innerHTML;
const sidebartempplates = document.querySelector('#sidebar-tempplate').innerHTML;

//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
const $newmessage = $messages.lastElementChild;
const newMessageStyle = getComputedStyle($newmessage);
const newMessageMargin = parseInt(newMessageStyle.marginBottom);
const newMessageHeight = $newmessage.offsetHeight + newMessageMargin;

const visibleHeight = $messages.offsetHeight;
const containerHeight = $messages.scrollHeight;

const scrollOffset = $messages.scrollTop + visibleHeight;

if((containerHeight - newMessageHeight) <= scrollOffset) {
    $messages.scrollTop =$messages.scrollHeight
}
}
socket.on('chatPerson', (message) => {
    console.log(message);
    const html = Mustache.render(tempplates, {
        username: message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})
socket.on('location', (locationlink) => {
    console.log(locationlink);
    const html = Mustache.render(locationtempplates, {
        username: locationlink.username,
        locationlink:locationlink.loc,
        createdAt:moment(locationlink.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})
socket.on('roomdata', ({room, users}) => {
    const html = Mustache.render(sidebartempplates, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    const search = e.target.elements.message;
    socket.emit('incriment', search.value, (err) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if(err) {
            return console.log(err)
        }
        console.log('delivered')
    })
})

$locationButton.addEventListener('click', () => {
   if(!navigator.geolocation) {
       return alert('geolocation not supported')
   }
   $locationButton.setAttribute('disabled', 'disabled');
   navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendlocation', {latitude:position.coords.latitude,longitude:position.coords.longitude}, (msg) => {
        console.log('delivered loc')
        $locationButton.removeAttribute('disabled');
    })
})
})

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    }
});