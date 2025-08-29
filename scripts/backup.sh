#!/bin/bash

# =============================================================================
# Virgin Fund - Backup Script
# Automated backup for database and volumes
# =============================================================================

set -e

# Configuration
PROJECT_NAME="virgin-fund"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
}

# Backup PostgreSQL database
backup_postgres() {
    log_info "Backing up PostgreSQL database..."

    local backup_file="$BACKUP_DIR/postgres_$TIMESTAMP.sql.gz"

    docker exec virgin-fund-postgres pg_dump -U virgin_fund_user virgin_fund | gzip > "$backup_file"

    if [ $? -eq 0 ]; then
        log_success "PostgreSQL backup created: $backup_file"
        echo "$backup_file"
    else
        log_error "PostgreSQL backup failed"
        exit 1
    fi
}

# Backup Redis data
backup_redis() {
    log_info "Backing up Redis data..."

    local backup_file="$BACKUP_DIR/redis_$TIMESTAMP.rdb"

    docker exec virgin-fund-redis redis-cli --raw BGSAVE

    # Wait for save to complete
    sleep 10

    docker cp virgin-fund-redis:/data/dump.rdb "$backup_file"

    if [ $? -eq 0 ]; then
        log_success "Redis backup created: $backup_file"
        echo "$backup_file"
    else
        log_error "Redis backup failed"
        exit 1
    fi
}

# Backup Docker volumes
backup_volumes() {
    log_info "Backing up Docker volumes..."

    local backup_file="$BACKUP_DIR/volumes_$TIMESTAMP.tar.gz"

    # Backup PostgreSQL volume
    docker run --rm -v virgin-fund_postgres_data:/data -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/postgres_volume_$TIMESTAMP.tar.gz -C /data .

    # Backup Redis volume
    docker run --rm -v virgin-fund_redis_data:/data -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/redis_volume_$TIMESTAMP.tar.gz -C /data .

    log_success "Volume backups created in: $BACKUP_DIR"
}

# Backup application data
backup_application() {
    log_info "Backing up application data..."

    local backup_file="$BACKUP_DIR/app_$TIMESTAMP.tar.gz"

    # Backup configuration and logs
    tar czf "$backup_file" \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='.git' \
        .env* \
        docker-compose*.yml \
        Dockerfile* \
        nginx/ \
        scripts/ \
        logs/ 2>/dev/null || true

    log_success "Application backup created: $backup_file"
}

# Clean old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups (older than $BACKUP_RETENTION_DAYS days)..."

    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.rdb" -mtime +$BACKUP_RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$BACKUP_RETENTION_DAYS -delete

    log_success "Old backups cleaned up"
}

# Generate backup report
generate_report() {
    local report_file="$BACKUP_DIR/backup_report_$TIMESTAMP.txt"

    {
        echo "Virgin Fund Backup Report"
        echo "========================="
        echo "Timestamp: $(date)"
        echo "Backup Directory: $BACKUP_DIR"
        echo ""
        echo "Files Created:"
        ls -la "$BACKUP_DIR" | grep "$TIMESTAMP"
        echo ""
        echo "Disk Usage:"
        du -sh "$BACKUP_DIR"/*
        echo ""
        echo "Backup Summary:"
        echo "- PostgreSQL: $(ls -la "$BACKUP_DIR"/*postgres*$TIMESTAMP* 2>/dev/null | wc -l) files"
        echo "- Redis: $(ls -la "$BACKUP_DIR"/*redis*$TIMESTAMP* 2>/dev/null | wc -l) files"
        echo "- Volumes: $(ls -la "$BACKUP_DIR"/*volume*$TIMESTAMP* 2>/dev/null | wc -l) files"
        echo "- Application: $(ls -la "$BACKUP_DIR"/*app*$TIMESTAMP* 2>/dev/null | wc -l) files"
    } > "$report_file"

    log_success "Backup report generated: $report_file"
}

# Verify backups
verify_backups() {
    log_info "Verifying backups..."

    # Check if backup files exist and are not empty
    local failed=0

    for file in "$BACKUP_DIR"/*"$TIMESTAMP"*; do
        if [ -f "$file" ]; then
            if [ ! -s "$file" ]; then
                log_error "Backup file is empty: $file"
                failed=1
            else
                log_success "Backup verified: $(basename "$file") ($(du -h "$file" | cut -f1))"
            fi
        fi
    done

    if [ $failed -eq 1 ]; then
        log_error "Some backups failed verification"
        exit 1
    fi
}

# Main backup function
main() {
    log_info "Starting backup for $PROJECT_NAME"

    create_backup_dir
    backup_postgres
    backup_redis
    backup_volumes
    backup_application
    verify_backups
    generate_report
    cleanup_old_backups

    log_success "Backup completed successfully!"
    log_info "Backup location: $BACKUP_DIR"
    log_info "Backup timestamp: $TIMESTAMP"
}

# Show usage
usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -d, --directory DIR    Backup directory (default: ./backups)"
    echo "  -r, --retention DAYS   Days to keep backups (default: 30)"
    echo "  -h, --help            Show this help"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 -d /mnt/backups -r 7"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--directory)
            BACKUP_DIR="$2"
            shift 2
            ;;
        -r|--retention)
            BACKUP_RETENTION_DAYS="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Run main function
main
