# Verantwoordingsdocument toets CMTPRG01-8
Hieronder noteer je de verantwoording, volgens de eisen van de beoordelingscriteria, van de volgende onderdelen: 

## Polymorfisme
Ik gebruik polymorfisme bij de speler, de piraten en de schat. Ze zijn namelijk allemaal gameobjecten met coördinaten in het scherm en functionaliteit bij een botsing met een ander gameobject. De overeenkomstige code zet ik in de abstracte class GameObject. Ik breng ze allemaal onder bij de noemer GameObject, zonder dat ze een instantie daarvan zijn. De class waarvan een instantie wordt gemaakt, erft van GameObject. Toch kan ik in de Game alle objecten generiek updaten en laten checken op botsingen door dat gemeenschappelijke stukje code.

## Singleton
In mijn project heb ik de game een Singleton gemaakt, omdat ik vanuit allerlei plekken in mijn project bij de game wil. De game instantie telkens als parameter meegeven is onhandig, dus ik gebruik het Singleton pattern op de Game class om er overal bij te kunnen.

## Strategy
Ik gebruik het Strategy pattern om het gedrag van de piratenschepen te laten wisselen. Het Strategy pattern is hier geschikt voor, omdat het gedrag direct aangepast moet worden als er iets gebeurt. Door dit patroon toe te passen, wordt het piratenschip vanuit zijn gedrag aangestuurd. Bij de update functie voert hij dan ook telkens het gedrag opnieuw uit. Bij een gedragswisseling, voert het piratenschip nog altijd zijn gedragsupdate uit, maar nu dus van het andere gedrag. Dit zorgt voor generieke code.

## Observer
Ik heb het Observer pattern toegepast bij de piraten en de speler. Het Observer pattern is hier ideaal voor, want de piraten moeten op de hoogte worden gebracht. Dit maakt de piratenschepen observers. De speler is het subject dat wordt geobserveerd - de gebeurtenis dat de speler een schat oppakt om precies te zijn. Wanneer dat gebeurt, stuurt de speler een melding naar alle observers die geregistreerd staan - in principe alle piratenschepen.