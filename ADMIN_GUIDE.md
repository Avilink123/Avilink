# 🛠️ Interface d'Administration AviMarché

## 📋 Guide d'Utilisation

### 🚀 **Accès à l'Interface Admin**

**Prérequis :**
- Connectez-vous avec le compte administrateur : **76123456** (Amadou Traoré)
- Le bouton "🛠️ Admin" apparaîtra dans la navigation
- Seul l'administrateur principal a accès à cette interface

### 📊 **Fonctionnalités Disponibles**

#### **1. Vue d'Ensemble (Dashboard Principal)**
- **Cartes de Statistiques :**
  - 👥 Total Utilisateurs
  - 📦 Produits Actifs  
  - 💰 Transactions
  - 📈 Bénéfice Net

- **Graphiques en Temps Réel :**
  - Répartition des utilisateurs par rôle (Aviculteur/Acheteur)
  - Distribution géographique (par localisation)
  - Résumé financier avec revenus/dépenses

#### **2. Gestion des Utilisateurs**
- **Tableau Complet :** Nom, téléphone, rôle, localisation, date d'inscription
- **Export CSV :** Liste complète des utilisateurs
- **Filtres Visuels :** Codes couleur par rôle et statut

#### **3. Gestion des Produits**
- **Catalogue Détaillé :** Titre, type, prix, vendeur, localisation, statut
- **Export CSV :** Inventaire complet des produits
- **Suivi des Ventes :** Statuts (disponible, vendu, suspendu)

#### **4. Suivi Financier**
- **Historique Complet :** Toutes les transactions des utilisateurs
- **Analyse par Type :** Revenus vs Dépenses
- **Export CSV :** Données financières pour analyse

#### **5. Informations Système**
- **État des Collections MongoDB**
- **Statut de la Plateforme** (API, Base de données)
- **Métriques Techniques**

### 📤 **Options d'Export**

#### **Export Complet (JSON)**
```bash
# Bouton "📊 Exporter Données" → "📋 Export Complet (JSON)"
# Contient TOUTES les données de la plateforme
```

#### **Exports Spécialisés (CSV)**
```bash
# 👥 Utilisateurs → Fichier CSV avec tous les comptes
# 📦 Produits → Catalogue complet en CSV  
# 💰 Transactions → Historique financier en CSV
```

### 🔧 **API Administrateur Direct**

Si vous préférez accéder aux données via API directement :

```bash
# Statistiques complètes
curl -X GET "http://localhost:8001/api/admin/stats"

# Export JSON complet  
curl -X GET "http://localhost:8001/api/admin/export" > backup_$(date +%Y%m%d).json

# Stats du dashboard principal
curl -X GET "http://localhost:8001/api/stats/dashboard"
```

### 🗄️ **Accès MongoDB Direct**

Pour les utilisateurs avancés :

```bash
# Se connecter à la base
mongosh test_database

# Voir toutes les collections
db.getCollectionNames()

# Exemples de requêtes
db.users.find({"role": "aviculteur"}).count()
db.products.find({"status": "disponible"})
db.financial_transactions.find().sort({"date_transaction": -1})
```

### 📈 **Utilisation des Données**

#### **Analyses Recommandées :**
- **Croissance :** Évolution du nombre d'utilisateurs
- **Activité :** Produits créés vs vendus
- **Géographie :** Concentration par région
- **Finances :** Rentabilité par utilisateur

#### **Exports Périodiques :**
- **Hebdomadaire :** Export CSV des nouvelles transactions
- **Mensuel :** Backup JSON complet
- **Trimestriel :** Analyse des tendances géographiques

### 🔒 **Sécurité et Bonnes Pratiques**

- ✅ **Accès Restreint :** Seul Amadou Traoré a accès admin
- ✅ **Pas de Modification :** Interface en lecture seule (sécurisé)
- ✅ **Exports Horodatés :** Tous les fichiers ont la date
- ✅ **Données Anonymisées :** Pas d'informations sensibles exposées

### 📞 **Support Technique**

Pour toute question technique ou demande d'amélioration de l'interface d'administration, les endpoints suivants fournissent des informations détaillées :

- **État Système :** `/api/admin/stats`
- **Données Complètes :** `/api/admin/export`
- **Dashboard Public :** `/api/stats/dashboard`

---

**🎯 L'interface d'administration AviMarché vous donne un contrôle total sur votre plateforme avicole malienne !**