
export interface IViewGroup {
    name: ViewGroupName;
    navSide: NavigationSide;
}

export enum ViewGroupName {
    arapca = 'a',
    meal = 'm',
    arapca_meal = 'am'
}

export enum NavigationSide {
    left = 'left',
    right = 'right'
}