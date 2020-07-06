interface Subject {
    subscribe(observer:Observer):void
    unsubscribe(observer:Observer):void
    notifyObservers():void
}