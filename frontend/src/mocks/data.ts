const recommendedEvents = [
  {
    id: 1,
    title: 'Event 1',
    description:
      'Maecenas semper ante et elit posuere, fermentum aliquet justo molestie. Curabitur vel lectus arcu. Integer rhoncus ante eget eleifend aliquam. Nunc ullamcorper magna a libero fermentum tincidunt. Nunc sit amet orci at metus dignissim semper at ut nibh. Pellentesque lorem nunc, porta ut augue tempor, congue consectetur mi. Nulla id semper nibh. Etiam ac ligula venenatis, placerat ipsum et, sollicitudin dolor. Aliquam erat volutpat. In eget nisl tincidunt, finibus nunc eget, placerat quam. In quis mauris cursus arcu dapibus mattis. Vivamus magna justo, vestibulum in leo vitae, ornare tristique tellus. Duis facilisis consequat sem nec accumsan. Fusce sit amet maximus nunc. Vivamus facilisis venenatis lectus vitae vestibulum.',
    category: 'Fandom',
    location_add: '666 Crown Street, Surry Hills NSW 2010',
    gps_coord: 'lat: -33.8771118, lng: 151.2114875',
    photo_url:
      'https://images.unsplash.com/photo-1629904869392-ae2a682d4d01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80',
    start_datetime: '2022-12-18T14:00',
    end_datetime: '2022-12-18T17:00',
    tags: 'photography, blogging, postaday',
    age_limit: 0,
    status: 'Ticket Available',
    tickets: [
      { ticket_type: 'VIP', total_number: 100, price: 1000 },
      { ticket_type: 'Gold', total_number: 200, price: 800 },
      { ticket_type: 'Silver', total_number: 300, price: 500 },
      { ticket_type: 'General', total_number: 500, price: 200 },
      { ticket_type: 'Standing', total_number: 150, price: 90 },
    ],
    created_by: 'Promie Yutasane',
  },
  {
    id: 2,
    title: 'Event 2',
    description:
      'Maecenas semper ante et elit posuere, fermentum aliquet justo molestie. Curabitur vel lectus arcu. Integer rhoncus ante eget eleifend aliquam. Nunc ullamcorper magna a libero fermentum tincidunt. Nunc sit amet orci at metus dignissim semper at ut nibh. Pellentesque lorem nunc, porta ut augue tempor, congue consectetur mi. Nulla id semper nibh. Etiam ac ligula venenatis, placerat ipsum et, sollicitudin dolor. Aliquam erat volutpat. In eget nisl tincidunt, finibus nunc eget, placerat quam. In quis mauris cursus arcu dapibus mattis. Vivamus magna justo, vestibulum in leo vitae, ornare tristique tellus. Duis facilisis consequat sem nec accumsan. Fusce sit amet maximus nunc. Vivamus facilisis venenatis lectus vitae vestibulum.',
    category: 'Fandom',
    location_add: '666 Crown Street, Surry Hills NSW 2010',
    gps_coord: 'lat: -33.8771118, lng: 151.2114875',
    photo_url:
      'https://images.unsplash.com/photo-1629904869392-ae2a682d4d01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80',
    start_datetime: '2022-12-18T14:00',
    end_datetime: '2022-12-18T17:00',
    tags: 'photography, blogging, postaday',
    age_limit: 0,
    status: 'Sold Out',
    tickets: [
      { ticket_type: 'VIP', total_number: 100, price: 1000 },
      { ticket_type: 'Gold', total_number: 200, price: 800 },
      { ticket_type: 'Silver', total_number: 300, price: 500 },
      { ticket_type: 'General', total_number: 500, price: 200 },
      { ticket_type: 'Standing', total_number: 150, price: 90 },
    ],
    created_by: 'Ho Tuan Vu',
  },
  {
    id: 3,
    title: 'Event 3',
    description:
      'Maecenas semper ante et elit posuere, fermentum aliquet justo molestie. Curabitur vel lectus arcu. Integer rhoncus ante eget eleifend aliquam. Nunc ullamcorper magna a libero fermentum tincidunt. Nunc sit amet orci at metus dignissim semper at ut nibh. Pellentesque lorem nunc, porta ut augue tempor, congue consectetur mi. Nulla id semper nibh. Etiam ac ligula venenatis, placerat ipsum et, sollicitudin dolor. Aliquam erat volutpat. In eget nisl tincidunt, finibus nunc eget, placerat quam. In quis mauris cursus arcu dapibus mattis. Vivamus magna justo, vestibulum in leo vitae, ornare tristique tellus. Duis facilisis consequat sem nec accumsan. Fusce sit amet maximus nunc. Vivamus facilisis venenatis lectus vitae vestibulum.',
    category: 'Fandom',
    location_add: '666 Crown Street, Surry Hills NSW 2010',
    gps_coord: 'lat: -33.8771118, lng: 151.2114875',
    photo_url:
      'https://images.unsplash.com/photo-1629904869392-ae2a682d4d01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80',
    start_datetime: '2022-12-18T14:00',
    end_datetime: '2022-12-18T17:00',
    tags: 'photography, blogging, postaday',
    age_limit: 0,
    status: 'Finished',
    tickets: [
      { ticket_type: 'VIP', total_number: 100, price: 1000 },
      { ticket_type: 'Gold', total_number: 200, price: 800 },
      { ticket_type: 'Silver', total_number: 300, price: 500 },
      { ticket_type: 'General', total_number: 500, price: 200 },
      { ticket_type: 'Standing', total_number: 150, price: 90 },
    ],
    created_by: 'Shridhar Prabhuraman',
  },
  {
    id: 4,
    title: 'Event 4',
    description:
      'Maecenas semper ante et elit posuere, fermentum aliquet justo molestie. Curabitur vel lectus arcu. Integer rhoncus ante eget eleifend aliquam. Nunc ullamcorper magna a libero fermentum tincidunt. Nunc sit amet orci at metus dignissim semper at ut nibh. Pellentesque lorem nunc, porta ut augue tempor, congue consectetur mi. Nulla id semper nibh. Etiam ac ligula venenatis, placerat ipsum et, sollicitudin dolor. Aliquam erat volutpat. In eget nisl tincidunt, finibus nunc eget, placerat quam. In quis mauris cursus arcu dapibus mattis. Vivamus magna justo, vestibulum in leo vitae, ornare tristique tellus. Duis facilisis consequat sem nec accumsan. Fusce sit amet maximus nunc. Vivamus facilisis venenatis lectus vitae vestibulum.',
    category: 'Fandom',
    location_add: '666 Crown Street, Surry Hills NSW 2010',
    gps_coord: 'lat: -33.8771118, lng: 151.2114875',
    photo_url:
      'https://images.unsplash.com/photo-1629904869392-ae2a682d4d01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80',
    start_datetime: '2022-12-18T14:00',
    end_datetime: '2022-12-18T17:00',
    tags: 'photography, blogging, postaday',
    age_limit: 0,
    status: 'Postponed',
    tickets: [
      { ticket_type: 'VIP', total_number: 100, price: 1000 },
      { ticket_type: 'Gold', total_number: 200, price: 800 },
      { ticket_type: 'Silver', total_number: 300, price: 500 },
      { ticket_type: 'General', total_number: 500, price: 200 },
      { ticket_type: 'Standing', total_number: 150, price: 90 },
    ],
    created_by: 'Rudra Jikadra',
  },
]

export { recommendedEvents }
