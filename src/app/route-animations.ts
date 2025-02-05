import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
  } from '@angular/animations';

export const slideLeftRoRight = trigger('routeAnimations', [
    transition('login => biller', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
            optional: true,
        }),
        group([
            query(
                ':enter',
                [
                    style({ transform: 'translateX(100%)' }),
                    animate(
                        '0.5s ease-in-out',
                        style({ transform: 'translateX(0%)' })
                    ),
                ],
                { optional: true }
            ),
            query(
                ':leave',
                [
                    style({ transform: 'translateX(0%)' }),
                    animate(
                        '0.5s ease-in-out',
                        style({ transform: 'translateX(-100%)' })
                    ),
                ],
                { optional: true }
            ),
        ]),
    ]),
    transition('biller => login', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
            optional: true,
        }),
        group([
            query(
                ':enter',
                [
                    style({ transform: 'translateX(-100%)' }),
                    animate(
                        '0.5s ease-in-out',
                        style({ transform: 'translateX(0%)' })
                    ),
                ],
                { optional: true }
            ),
            query(
                ':leave',
                [
                    style({ transform: 'translateX(0%)' }),
                    animate(
                        '0.5s ease-in-out',
                        style({ transform: 'translateX(100%)' })
                    ),
                ],
                { optional: true }
            ),
        ]),
    ]),
]);

export const slider =
  trigger('routeAnimations', [
    transition('* => isLeft', slideTo('left') ),
    transition('* => isRight', slideTo('right') ),
    transition('isRight => *', slideTo('left') ),
    transition('isLeft => *', slideTo('right') )
  ]);

function slideTo(direction:string) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ]),
    group([
      query(':leave', [
        animate('600ms ease', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({ [direction]: '0%'}))
      ])
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}