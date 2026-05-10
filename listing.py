import os
from pathlib import Path

def create_code_listing(project_path, output_file="code_listing.txt", 
                       extensions=None, exclude_folders=None):
    """
    Создает листинг кода ВСЕХ файлов, кроме системных папок
    """
    if extensions is None:
        # базовые расширения
        extensions = {
            '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
            '.html', '.htm', '.css', '.scss', '.sass', '.less',
            '.xml', '.json', '.yaml', '.yml',
            '.md', '.txt', '.cfg', '.conf',
            '.sql', '.graphql', '.gql'
        }
    
    if exclude_folders is None:
        # исключаемые системные папки
        exclude_folders = {
            '.git', '__pycache__', '.pytest_cache', '.mypy_cache',
            'node_modules', 'vendor', 'packages',
            'dist', 'build', 'out', 'target', 'bin', 'obj',
            '.idea', '.vscode', '.vs',
            'venv', 'env', '.env', 'virtualenv',
            '.next', '.nuxt', '.cache', 'tmp', 'temp',
            'coverage', '.nyc_output',
            'logs', '.logs'
        }
    
    project_path = Path(project_path).resolve()
    output_path = Path(output_file)
    
    files_processed = 0
    
    with open(output_path, 'w', encoding='utf-8', newline='\n') as out_file:
        for root, dirs, files in os.walk(project_path):
            # Получаем относительный путь текущей папки
            current_rel_path = Path(root).relative_to(project_path)
            
            # Проверяем, не исключена ли текущая или родительская папка
            should_skip = False
            for part in current_rel_path.parts:
                if part in exclude_folders:
                    should_skip = True
                    break
            
            if should_skip:
                # Пропускаем всю ветку
                dirs[:] = []
                continue
            
            # обработка файлов
            for file in files:
                file_path = Path(root) / file
                
                # Проверяем расширение файла
                if file_path.suffix.lower() in extensions:
                    try:
                        # Получаем относительный путь
                        rel_path = file_path.relative_to(project_path)
                        
                        # Записываем путь к файлу
                        out_file.write(f"#{rel_path}\n\n")
                        
                        # Читаем содержимое файла
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        # Записываем содержимое
                        out_file.write(content)
                        
                        # Разделитель между файлами
                        out_file.write("\n\n")
                        
                        files_processed += 1
                        print(f"[{files_processed}] ✓ {rel_path}")
                        
                    except UnicodeDecodeError:
                        # Пропускаем бинарные файлы
                        pass
                    except Exception as e:
                        print(f"✗ Ошибка с {rel_path}: {e}")
    
    print(f"\n✅ Готово! Обработано файлов: {files_processed}")
    return files_processed

def show_project_structure(project_path, exclude_folders=None, extensions=None):
    """Показать структуру проекта (что будет включено)"""
    if exclude_folders is None:
        exclude_folders = {
            '.git', 'node_modules', 'dist', 'build',
            '.idea', '.vscode', 'venv', '__pycache__'
        }
    
    project_path = Path(project_path).resolve()
    
    print("📁 Структура проекта:")
    print("=" * 50)
    
    for root, dirs, files in os.walk(project_path):
        # Фильтруем исключенные папки
        dirs[:] = [d for d in dirs if d not in exclude_folders]
        
        level = root.replace(str(project_path), '').count(os.sep)
        indent = ' ' * 2 * level
        rel_path = Path(root).relative_to(project_path)
        
        if str(rel_path) == '.':
            print(f"{indent}📦 {project_path.name}/")
        else:
            print(f"{indent}📁 {Path(root).name}/")
        
        subindent = ' ' * 2 * (level + 1)
        
        # Показываем файлы с кодом
        code_files = [f for f in files if Path(f).suffix in extensions]
        for file in code_files:  # Показываем файлы
            print(f"{subindent}📄 {file}")


project_path = "."  # Текущая папка
exclude_folders = {'.git', 'config', 'data', 'logs', 'node_modules', 'postgresql'}
extensions = {
    '.html', '.css',
    '.config.ts', '.config', '.config.js', '.prettierrc', '.conf.template', '.template',
    '.ts', '.tsx', '.jsx' '.js', '.d.ts',
    '.yml', '', '.json', '.md',
    '.svg', '.webp', '.jpg', '.jpeg', '.png', '.avif'
}

# проверка
show_project_structure(project_path, exclude_folders, extensions)

# листинг
# create_code_listing(
#     project_path=project_path,
#     output_file="listed_frontend.txt",
#     extensions=extensions,
#     exclude_folders=exclude_folders
# )