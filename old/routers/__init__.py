import os
import importlib
from fastapi import APIRouter

# Créez un routeur principal pour l'application
router = APIRouter()

# Fonction pour importer tous les modules de routeurs
def load_routers():
    current_dir = os.path.dirname(__file__)
    
    for filename in os.listdir(current_dir):
        # Ignorer les fichiers qui ne sont pas des fichiers Python ou qui ne sont pas des sous-dossiers
        if filename.endswith(".py") and filename != "__init__.py":
            module_name = filename[:-3]  # Retire '.py'
            module = importlib.import_module(f".{module_name}", package=__name__)
            if hasattr(module, 'router'):
                router.include_router(module.router)

    # Traitez les sous-dossiers
    for subdir in os.listdir(current_dir):
        subdir_path = os.path.join(current_dir, subdir)
        if os.path.isdir(subdir_path):
            # Ignorer les sous-dossiers qui ne contiennent pas de fichiers Python ou qui ne sont pas un package
            if os.path.isfile(os.path.join(subdir_path, "__init__.py")):
                for filename in os.listdir(subdir_path):
                    if filename.endswith(".py") and filename != "__init__.py":
                        module_name = f"{subdir}.{filename[:-3]}"  # Crée le nom du module
                        module = importlib.import_module(f".{module_name}", package=__name__)
                        if hasattr(module, 'router'):
                            router.include_router(module.router)

# Charger les routeurs
load_routers()