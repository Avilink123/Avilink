#!/bin/bash
echo "🚛 TRANSPORT DE TES DONNÉES VERS LE CLOUD"
echo ""
echo "⚠️  AVANT DE LANCER CE SCRIPT:"
echo "   1. Va sur MongoDB Atlas"
echo "   2. Récupère ta chaîne de connexion"
echo "   3. Remplace YOUR_CONNECTION_STRING ci-dessous"
echo ""
echo "📝 Commande à utiliser:"
echo "mongorestore --uri \"YOUR_CONNECTION_STRING\" --db avimarche_db /app/backup_avimarche/test_database/"
echo ""
echo "🎯 Exemple avec une vraie chaîne:"
echo "mongorestore --uri \"mongodb+srv://user:password@cluster0.xyz.mongodb.net/\" --db avimarche_db /app/backup_avimarche/test_database/"

