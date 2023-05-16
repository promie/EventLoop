const reviews = [
  {
    id: 1,
    user_id: 1,
    photo_url:
      'https://stickershop.line-scdn.net/stickershop/v1/product/15492/LINEStorePC/main.png;compress=true',
    created_by: 'Amir Esparza',
    rating: 3,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-20',
  },
  {
    id: 2,
    user_id: 2,
    photo_url:
      'https://replicate.com/api/models/lambdal/text-to-pokemon/files/4d12a241-fd84-4b0a-8321-80dd8c6ae784/out-0.png',
    created_by: 'Misael Reid',
    rating: 4,
    comment:
      'Praesent pharetra quam sem, a convallis elit semper quis. Morbi egestas consectetur nibh a semper. Aliquam rutrum leo neque, et faucibus erat maximus eu. Integer nec faucibus ante. Curabitur aliquet elementum leo a elementum. Sed tempor lorem vitae tortor maximus, sed pellentesque mi dictum. Mauris lorem nisi, fermentum sed tortor vitae, pharetra blandit ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue ultricies lacus. Sed nec tempor ligula. Aliquam sed velit purus. Aliquam consectetur ornare leo cursus aliquet. Cras at faucibus nunc, id suscipit dolor. Maecenas rhoncus enim sit amet nisl scelerisque pellentesque. Nam auctor ligula vel efficitur cursus. Vivamus iaculis eleifend erat, nec faucibus leo accumsan sit amet.',
    created_date: '2022-10-19',
  },
  {
    id: 3,
    user_id: 3,
    photo_url:
      'https://sportshub.cbsistatic.com/i/2022/06/01/809f7b46-557b-4e6c-b55a-867f207ca223/pokemon-sv-pawmi-key-art.png?auto=webp&width=2018&height=1752&crop=1.152:1,smart',
    created_by: 'Jillian Logan',
    rating: 2,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-18',
  },
  {
    id: 4,
    user_id: 4,
    photo_url: null,
    created_by: 'Caden Frederick',
    rating: 1,
    comment:
      'Donec nibh velit, feugiat eget justo dignissim, mattis lacinia diam. Aenean non sem tincidunt, sollicitudin lectus in, dapibus sem. Nulla auctor aliquam sem, vitae porta nisl feugiat vitae. Mauris ultricies in est vitae molestie. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent nec sollicitudin mi. In interdum nisl ex, vel convallis ipsum consectetur ac. In vestibulum nibh ac felis consequat tempus. Sed sed maximus ligula.',
    created_date: '2022-10-17',
  },
  {
    id: 5,
    user_id: 5,
    photo_url:
      'https://i.pinimg.com/736x/d4/d1/a6/d4d1a651687744c58db9266e22bc68da--pokemon-jigglypuff-pikachu.jpg',
    created_by: 'Mario Abbott',
    rating: 5,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-16',
  },
  {
    id: 6,
    user_id: 6,
    photo_url: 'https://os-cdn.ec-ffmt.com/gl/pokemon/dedicate/pokedex/404.png',
    created_by: 'Caitlyn Roman',
    rating: 3,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-15',
  },
  {
    id: 7,
    user_id: 7,
    photo_url: 'https://os-cdn.ec-ffmt.com/gl/pokemon/dedicate/pokedex/447.png',
    created_by: 'Kevin Joseph',
    rating: 2,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-14',
  },
  {
    id: 8,
    user_id: 8,
    photo_url: null,
    created_by: 'Daniela Costa',
    rating: 5,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-13',
  },
  {
    id: 9,
    user_id: 9,
    photo_url: 'https://os-cdn.ec-ffmt.com/gl/pokemon/dedicate/pokedex/454.png',
    created_by: 'Norah Duke',
    rating: 2,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-12',
  },
  {
    id: 10,
    user_id: 10,
    photo_url: 'https://os-cdn.ec-ffmt.com/gl/pokemon/dedicate/pokedex/294.png',
    created_by: 'Tia White',
    rating: 5,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-11',
  },
  {
    id: 11,
    user_id: 11,
    photo_url: 'https://os-cdn.ec-ffmt.com/gl/pokemon/dedicate/pokedex/68.png',
    created_by: 'Samuel Crane',
    rating: 5,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam convallis diam ut nulla tincidunt congue. Nam facilisis rutrum imperdiet. Fusce sed feugiat orci, vel porta mi. Sed at purus ac erat ultrices cursus at in nulla. Nulla pharetra magna ac tortor cursus maximus. Nullam sit amet odio vitae odio bibendum ornare. Fusce volutpat euismod metus, vehicula auctor lacus convallis eu. Quisque quis venenatis dolor, id luctus velit. Nam quis massa arcu. Vivamus semper dapibus commodo.',
    created_date: '2022-10-10',
  },
  {
    id: 12,
    user_id: 12,
    photo_url: 'https://os-cdn.ec-ffmt.com/gl/pokemon/dedicate/pokedex/61.png',
    created_by: 'Isai Francis',
    rating: 3,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-09',
  },
  {
    id: 13,
    user_id: 13,
    photo_url: 'https://os-cdn.ec-ffmt.com/gl/pokemon/dedicate/pokedex/241.png',
    created_by: 'Bella Colon',
    rating: 2,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-08',
  },
  {
    id: 14,
    user_id: 14,
    photo_url: 'https://os-cdn.ec-ffmt.com/gl/pokemon/dedicate/pokedex/446.png',
    created_by: 'Marin Diaz',
    rating: 4,
    comment:
      'Suspendisse semper nisi metus, quis ullamcorper nisl congue sit amet. Etiam eget ligula enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In lacinia tristique metus, vel volutpat lectus finibus vel. Vivamus egestas, quam at feugiat sodales, ligula est pretium tellus, vitae aliquam velit odio quis lorem. Etiam sapien ipsum, viverra a justo faucibus, sollicitudin volutpat orci. Ut velit quam, egestas in posuere id, pretium non velit. Quisque id risus eu enim semper feugiat. Proin fermentum turpis a porta tincidunt.',
    created_date: '2022-10-07',
  },
  {
    id: 15,
    user_id: 15,
    photo_url: '',
    created_by: 'Cayden Armstrong',
    rating: 5,
    comment:
      'Nunc a ex pellentesque, blandit sem at, varius dolor. Curabitur congue sapien ac venenatis imperdiet. Integer pellentesque, eros non blandit convallis, ante dolor blandit est, id ultricies orci enim non ligula. Aenean feugiat sed ex nec sollicitudin. Cras ac ultricies erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus euismod congue tincidunt.',
    created_date: '2022-10-06',
  },
]

export { reviews }
