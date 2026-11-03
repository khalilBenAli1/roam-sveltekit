import type { Activity, Category, Plans } from './domain';
const a = (
  id: string,
  title: string,
  place: string,
  category: Category,
  start: number,
  duration: number,
  cents: number,
  note = ''
): Activity => ({ id, title, place, category, start, duration, cents, note });
export function demoPlans(): Plans {
  return {
    version: 1,
    trips: [
      {
        id: 'kyoto',
        title: 'A little lost in Kyoto',
        country: 'Japan',
        intro:
          'Slow mornings, hidden lanes, and a very good bowl of ramen. Leave a little room for getting lost.',
        travelers: 2,
        budgetCents: 65000,
        days: [
          {
            id: 'kyoto-1',
            date: '2027-04-12',
            title: 'The old town, slowly',
            activities: [
              a(
                'k1',
                'A slow start at the coffee bar',
                'Higashiyama · Kyoto',
                'Food',
                540,
                45,
                1800,
                'A quiet coffee before the city wakes up.'
              ),
              a(
                'k2',
                'Wander through Higashiyama',
                'Ninenzaka & Sannenzaka',
                'Explore',
                615,
                120,
                0,
                'Take the side streets. The best part is the walk.'
              ),
              a(
                'k3',
                'Lunch at the little noodle shop',
                'Gion · Kyoto',
                'Food',
                765,
                60,
                3200
              ),
              a(
                'k4',
                'An afternoon among the temples',
                'Kiyomizu-dera area',
                'Explore',
                870,
                90,
                1400,
                'Bring a sketchbook and take your time.'
              )
            ]
          },
          {
            id: 'kyoto-2',
            date: '2027-04-13',
            title: 'Into the green',
            activities: [
              a(
                'k5',
                'Early bamboo grove walk',
                'Arashiyama',
                'Explore',
                480,
                120,
                0
              ),
              a(
                'k6',
                'Tea by the river',
                'Katsura riverside',
                'Food',
                660,
                60,
                2400
              ),
              a(
                'k7',
                'A tiny guesthouse for the night',
                'West Kyoto',
                'Stay',
                1080,
                60,
                14000
              )
            ]
          },
          {
            id: 'kyoto-3',
            date: '2027-04-14',
            title: 'Follow your curiosity',
            activities: []
          },
          {
            id: 'kyoto-4',
            date: '2027-04-15',
            title: 'One last look',
            activities: [
              a(
                'k8',
                'Train to the next chapter',
                'Kyoto Station',
                'Travel',
                660,
                90,
                6400
              )
            ]
          }
        ],
        saved: [
          a(
            'ks1',
            'The philosopher’s path',
            'Sakyo Ward · Kyoto',
            'Explore',
            960,
            90,
            0,
            'A meandering canal-side walk.'
          ),
          a(
            'ks2',
            'Nishiki market lunch',
            'Central Kyoto',
            'Food',
            720,
            75,
            3600
          ),
          a(
            'ks3',
            'A small ceramics studio',
            'Gojo-zaka',
            'Explore',
            840,
            60,
            2000
          )
        ]
      },
      {
        id: 'lisbon',
        title: 'Lisbon, in no hurry',
        country: 'Portugal',
        intro:
          'Tile-lined streets, coffee in the square, and golden light over the river. A long weekend with no rush.',
        travelers: 2,
        budgetCents: 48000,
        days: [
          {
            id: 'lisbon-1',
            date: '2027-05-21',
            title: 'Up the winding streets',
            activities: [
              a(
                'l1',
                'Coffee & a pastel de nata',
                'Alfama',
                'Food',
                540,
                45,
                1200
              ),
              a(
                'l2',
                'Get lost in the old quarter',
                'Alfama lanes',
                'Explore',
                600,
                120,
                0
              ),
              a(
                'l3',
                'Sunset by the water',
                'Ribeira das Naus',
                'Explore',
                1080,
                60,
                0
              )
            ]
          },
          {
            id: 'lisbon-2',
            date: '2027-05-22',
            title: 'Out by the ocean',
            activities: [
              a(
                'l4',
                'Coastal train ride',
                'Cais do Sodré',
                'Travel',
                540,
                60,
                1400
              ),
              a('l5', 'A long seafood lunch', 'Cascais', 'Food', 750, 90, 6800)
            ]
          },
          {
            id: 'lisbon-3',
            date: '2027-05-23',
            title: 'Make it your own',
            activities: []
          }
        ],
        saved: [
          a('ls1', 'A bookshop afternoon', 'Chiado', 'Explore', 840, 60, 0),
          a(
            'ls2',
            'Tile museum wander',
            'Eastern Lisbon',
            'Explore',
            600,
            120,
            2400
          )
        ]
      },
      {
        id: 'dolomites',
        title: 'A breath of alpine air',
        country: 'Italy',
        intro:
          'Lakes the color of a daydream. Long trails, early nights, and the kind of quiet you can carry home.',
        travelers: 2,
        budgetCents: 72000,
        days: [
          {
            id: 'dolomites-1',
            date: '2027-06-05',
            title: 'Lakeside beginnings',
            activities: [
              a(
                'd1',
                'Breakfast with a mountain view',
                'Val di Funes',
                'Food',
                480,
                60,
                2800
              ),
              a(
                'd2',
                'The lakeside trail',
                'Alpine lake loop',
                'Explore',
                600,
                180,
                0
              ),
              a(
                'd3',
                'Settle into the mountain lodge',
                'Valley base',
                'Stay',
                1020,
                60,
                18000
              )
            ]
          },
          {
            id: 'dolomites-2',
            date: '2027-06-06',
            title: 'A higher perspective',
            activities: [
              a(
                'd4',
                'A gentle ridgeline walk',
                'Alpine meadow trail',
                'Explore',
                540,
                240,
                0
              ),
              a(
                'd5',
                'Lunch at a mountain hut',
                'Rifugio stop',
                'Food',
                840,
                75,
                4800
              )
            ]
          },
          {
            id: 'dolomites-3',
            date: '2027-06-07',
            title: 'The unplanned day',
            activities: []
          }
        ],
        saved: [
          a('ds1', 'A meadow picnic', 'Valley footpath', 'Food', 720, 90, 3000),
          a(
            'ds2',
            'Early light at the lake',
            'Lakeside viewpoint',
            'Explore',
            420,
            60,
            0
          )
        ]
      }
    ]
  };
}
