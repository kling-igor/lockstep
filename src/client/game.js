const Loader = PIXI.Loader.shared

export default app => {
  Loader.add('images/sprite.png').load(() => {
    const sprite = new PIXI.Sprite(Loader.resources['images/sprite.png'].texture)
    app.stage.addChild(sprite)
  })
}
