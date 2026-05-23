# Bus Station

Ce projet est une plateforme multi-tenante de gestion complète destinée aux gares routières et aux agences de transport.
Il vise à moderniser, automatiser et centraliser toutes les opérations liées au fonctionnement d’une gare, depuis
l’administration des agences jusqu’à la gestion du trafic des véhicules.
Il s’intègre dans un écosystème plus large comprenant une application mobile et d'autres services backend.
Le système permet d’enregistrer et de gérer les sociétés de transport, leurs agences, ainsi que leurs véhicules. Il
assure le contrôle et le suivi des opérations quotidiennes d’une gare : validation des sociétés, organisation des
départs et arrivées, gestion du ticket de quai, collecte des taxes, gestion des sanctions et supervision du
stationnement et ainsi que la gestion des reservations de voyage pour les clients.


# Technologies utilisées

-[NVM](https://www.nvmnode.com/fr/guide/download.html) (Version Windows)


## SetUp

Pour compiler le projet suivez ces instructions

```bash
git clone https://github.com/cestbryan-ng/busstationv2.git
cd busstationv2

# Installer les dépendances
npm install

# Démarrer le serveur (Peut démander node >= 20.9.0)
# nvm install 20.9.0 ou une version ultérieure
# nvm use 20.9.0
npm run dev
```
