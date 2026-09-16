import sys

print("Python:", sys.version)
for pkg in ["numpy", "scipy", "pandas", "sklearn", "matplotlib", "torch", "seaborn"]:
    try:
        mod = __import__(pkg)
        print(f"{pkg}: {getattr(mod, '__version__', 'installed')}")
    except Exception as e:
        print(f"{pkg}: {e}")
