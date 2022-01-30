# pdf-component



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description         | Type     | Default     |
| -------- | --------- | ------------------- | -------- | ----------- |
| `src`    | `src`     | PDF document source | `string` | `undefined` |


## Events

| Event          | Description                           | Type                  |
| -------------- | ------------------------------------- | --------------------- |
| `pageRendered` | Emitted when a page has been rendered | `CustomEvent<number>` |


## Dependencies

### Depends on

- ion-card
- ion-spinner
- ion-buttons
- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  pdf-component --> ion-card
  pdf-component --> ion-spinner
  pdf-component --> ion-buttons
  pdf-component --> ion-button
  pdf-component --> ion-icon
  ion-card --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  style pdf-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
