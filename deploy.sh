#!/bin/bash

# 待办事项列表应用 - 快速部署脚本
# 作者: 小虾米(devops-engineer)
# 日期: 2026-03-31

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# 显示欢迎信息
echo "=========================================="
echo "  待办事项列表应用 - 快速部署脚本"
echo "=========================================="
echo ""

# 检查 Node.js
check_nodejs() {
    print_info "检查 Node.js..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js 已安装: $NODE_VERSION"
    else
        print_error "Node.js 未安装,请先安装 Node.js >= 18.0.0"
        exit 1
    fi
}

# 检查 npm
check_npm() {
    print_info "检查 npm..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_success "npm 已安装: $NPM_VERSION"
    else
        print_error "npm 未安装"
        exit 1
    fi
}

# 安装依赖
install_dependencies() {
    print_info "安装依赖..."
    cd src/frontend
    npm install
    print_success "依赖安装完成"
    cd ../..
}

# 运行 Linter
run_linter() {
    print_info "运行代码检查..."
    cd src/frontend
    npm run lint
    print_success "代码检查通过"
    cd ../..
}

# 构建应用
build_app() {
    print_info "构建应用..."
    cd src/frontend
    npm run build
    print_success "应用构建完成"
    print_info "构建产物: src/frontend/dist"
    cd ../..
}

# 验证构建产物
verify_build() {
    print_info "验证构建产物..."
    if [ -d "src/frontend/dist" ]; then
        FILE_COUNT=$(find src/frontend/dist -type f | wc -l)
        print_success "构建产物验证通过 ($FILE_COUNT 个文件)"
    else
        print_error "构建产物不存在"
        exit 1
    fi
}

# 部署选项菜单
show_deploy_menu() {
    echo ""
    echo "请选择部署方式:"
    echo "1) Vercel (推荐 - 零配置)"
    echo "2) Netlify (零配置)"
    echo "3) GitHub Pages (免费)"
    echo "4) Docker (容器化)"
    echo "5) 本地预览"
    echo "6) 退出"
    echo ""
    read -p "请输入选项 (1-6): " choice

    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_github_pages
            ;;
        4)
            deploy_docker
            ;;
        5)
            preview_local
            ;;
        6)
            print_info "退出部署脚本"
            exit 0
            ;;
        *)
            print_error "无效选项"
            exit 1
            ;;
    esac
}

# 部署到 Vercel
deploy_vercel() {
    print_info "部署到 Vercel..."
    print_warning "请确保已安装 Vercel CLI: npm install -g vercel"
    print_warning "请确保已登录 Vercel: vercel login"

    read -p "是否继续部署到 Vercel? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        cd src/frontend
        vercel --prod
        print_success "部署到 Vercel 完成"
        cd ../..
    else
        print_info "已取消部署"
    fi
}

# 部署到 Netlify
deploy_netlify() {
    print_info "部署到 Netlify..."
    print_warning "请确保已安装 Netlify CLI: npm install -g netlify-cli"
    print_warning "请确保已登录 Netlify: netlify login"

    read -p "是否继续部署到 Netlify? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        cd src/frontend
        netlify deploy --prod --dir=dist
        print_success "部署到 Netlify 完成"
        cd ../..
    else
        print_info "已取消部署"
    fi
}

# 部署到 GitHub Pages
deploy_github_pages() {
    print_info "部署到 GitHub Pages..."
    print_warning "请确保已推送代码到 GitHub"
    print_warning "请在 GitHub 仓库设置中启用 Pages,并选择 GitHub Actions 作为 Source"

    print_info "部署指南: docs/devops-engineer/deploy-guide.md#33-方案三github-pages-部署"
}

# 部署到 Docker
deploy_docker() {
    print_info "部署到 Docker..."
    print_warning "请确保已安装 Docker 和 Docker Compose"

    read -p "是否继续构建 Docker 镜像? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        docker-compose build
        print_success "Docker 镜像构建完成"

        read -p "是否启动 Docker 容器? (y/n): " start_confirm
        if [ "$start_confirm" = "y" ]; then
            docker-compose up -d
            print_success "Docker 容器已启动"
            print_info "访问地址: http://localhost"
        fi
    else
        print_info "已取消部署"
    fi
}

# 本地预览
preview_local() {
    print_info "启动本地预览..."
    cd src/frontend
    npm run preview
    cd ../..
}

# 主流程
main() {
    check_nodejs
    check_npm

    echo ""
    read -p "是否需要安装依赖? (y/n): " install_confirm
    if [ "$install_confirm" = "y" ]; then
        install_dependencies
    fi

    read -p "是否需要运行代码检查? (y/n): " lint_confirm
    if [ "$lint_confirm" = "y" ]; then
        run_linter
    fi

    read -p "是否需要构建应用? (y/n): " build_confirm
    if [ "$build_confirm" = "y" ]; then
        build_app
        verify_build
    fi

    show_deploy_menu
}

# 运行主流程
main
