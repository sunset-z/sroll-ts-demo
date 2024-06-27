import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir, readdir, copyFile, rm } from 'fs/promises';
import packageJson from '../package.json' assert { type: 'json' };

// 环境
const isDev = process.env.NODE_ENV !== 'production';

//  在 EM 不能直接使用：__dirname is not defined in ES module scope
const __filename = fileURLToPath(import.meta.url); // 获取文件的解析路径
const __dirname = path.dirname(__filename); // 获取目录的名称

// 指定的源目录和目标目录
const sourceDir = path.resolve(__dirname, '..', 'dist');
const tempDir = path.resolve(__dirname, '..', 'temp');
const outputDir = path.resolve(__dirname, '..');

// 递归复制目录及其内容
async function copyDirectory(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

// 主函数
async function main() {
  // 确保输出目录存在
  await mkdir(outputDir, { recursive: true });

  // 删除临时目录
  if (fs.existsSync(tempDir)) await rm(tempDir, { recursive: true, force: true });

  // 确保临时目录存在
  await mkdir(tempDir, { recursive: true });

  // 复制指定目录下的所有文件到临时目录
  await copyDirectory(sourceDir, tempDir);

  // 在临时目录中创建 package.json 文件
  const packageJsonPath = path.resolve(tempDir, 'package.json');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // 复制 readme.md 文件
  const readmePath = path.resolve(__dirname, '..', 'README.md');
  const readmeDestPath = path.resolve(tempDir, 'README.md');
  if (fs.existsSync(readmePath)) await copyFile(readmePath, readmeDestPath);

  // 在临时目录中运行 npm pack
  execSync('npm pack', { cwd: tempDir, stdio: 'inherit' });

  // 查找生成的 tarball 文件
  const tarballName = `${packageJson.name.replace('@', '').replace(/\//, '-')}-${packageJson.version}.tgz`;

  // 移动 tarball 文件到自定义输出目录
  const tempFilePath = path.join(tempDir, tarballName);
  const tgzFilePath = path.join(outputDir, tarballName);
  fs.renameSync(tempFilePath, tgzFilePath);

  // 删除临时目录
  await rm(tempDir, { recursive: true, force: true });

  console.log(`------------ Tarball moved to ${outputDir} ------------`);

  if (isDev) {
    console.log('当前环境为开发环境，不执行发布操作');
    return;
  }

  // 继续发布
  try {
    execSync(`npm publish ${tgzFilePath}`, { stdio: 'inherit' });
    console.log('------------ Package published successfully ------------');
  } catch (error) {
    console.error('------------ Failed to publish package:', error.message, '------------');
    process.exit(1);
  }
}

main().catch(console.error);
