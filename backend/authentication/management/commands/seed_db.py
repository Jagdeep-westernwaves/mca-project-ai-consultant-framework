from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from clients.models import Client
from projects.models import Project
from audit_logging.models import AuditLog
from notifications.models import Notification
from datetime import date, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with realistic administrative, client, and project records."

    def handle(self, *args, **options):
        self.stdout.write("Initializing database seeding sequence...")

        # 1. Create Default Users (Role-based)
        users = [
            {'username': 'admin', 'email': 'admin@aimcf.com', 'role': 'admin', 'pass': 'adminpassword123', 'first': 'Dev', 'last': 'Admin'},
            {'username': 'consultant', 'email': 'consultant@aimcf.com', 'role': 'consultant', 'pass': 'consultant123', 'first': 'Sarah', 'last': 'Jenkins'},
            {'username': 'client_user', 'email': 'client@aimcf.com', 'role': 'client', 'pass': 'client123', 'first': 'John', 'last': 'Doe'},
        ]

        created_users = {}
        for u in users:
            existing = User.objects.filter(username=u['username']).first()
            if not existing:
                user = User.objects.create_user(
                    username=u['username'],
                    email=u['email'],
                    role=u['role'],
                    password=u['pass'],
                    first_name=u['first'],
                    last_name=u['last']
                )
                self.stdout.write(self.style.SUCCESS(f"User created: {u['username']} ({u['role']})"))
                created_users[u['role']] = user
            else:
                self.stdout.write(f"User {u['username']} already exists.")
                created_users[u['role']] = existing

        # Ensure admin is marked as is_staff/is_superuser for Django admin access
        admin_user = created_users.get('admin')
        if admin_user and not admin_user.is_superuser:
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()

        # Get a consultant to assign clients to
        consultant = created_users.get('consultant')

        # 2. Create Clients
        client_data = [
            {'name': 'Acme Global Logistics', 'industry': 'Logistics', 'rev': 12500000.00, 'emp': 450},
            {'name': 'Nexus Health Systems', 'industry': 'Healthcare', 'rev': 28400000.00, 'emp': 1200},
            {'name': 'Quantum FinTech Labs', 'industry': 'FinTech', 'rev': 8900000.00, 'emp': 120},
            {'name': 'EcoCommerce Retailers', 'industry': 'E-Commerce', 'rev': 4300000.00, 'emp': 85},
        ]

        created_clients = []
        for c in client_data:
            existing = Client.objects.filter(name=c['name']).first()
            if not existing:
                client = Client.objects.create(
                    name=c['name'],
                    industry=c['industry'],
                    annual_revenue=c['rev'],
                    employee_count=c['emp'],
                    assigned_consultant=consultant
                )
                self.stdout.write(self.style.SUCCESS(f"Client created: {c['name']}"))
                created_clients.append(client)
            else:
                self.stdout.write(f"Client {c['name']} already exists.")
                created_clients.append(existing)

        # Link client_user to Acme Global Logistics
        client_user = created_users.get('client')
        if client_user and created_clients:
            client_user.client = created_clients[0]
            client_user.save()
            self.stdout.write(self.style.SUCCESS(f"Linked user {client_user.username} to client {created_clients[0].name}"))

        # 3. Create Projects
        project_data = [
            {'client': created_clients[0], 'name': 'Supply Chain Optimization', 'desc': 'Apply machine learning forecasting to streamline warehouse scheduling and minimize freight lags.', 'status': 'active', 'days_start': -30, 'days_end': 60, 'budget': 120000.00},
            {'client': created_clients[1], 'name': 'Patient Care Telemetry', 'desc': 'NLP extraction on clinical logs to profile risk parameters and optimize resource planning.', 'status': 'completed', 'days_start': -120, 'days_end': -10, 'budget': 240000.00},
            {'client': created_clients[2], 'name': 'Predictive Churn Safeguard', 'desc': 'Deploy Classification algorithms to identify high attrition merchant portfolios.', 'status': 'active', 'days_start': -15, 'days_end': 120, 'budget': 85000.00},
            {'client': created_clients[3], 'name': 'Direct-to-Consumer Growth Plan', 'desc': 'Re-engineer marketing budget allocations using dynamic sales simulations.', 'status': 'planning', 'days_start': 10, 'days_end': 90, 'budget': 45000.00},
        ]

        for p in project_data:
            existing = Project.objects.filter(name=p['name'], client=p['client']).first()
            if not existing:
                Project.objects.create(
                    client=p['client'],
                    name=p['name'],
                    description=p['desc'],
                    status=p['status'],
                    start_date=date.today() + timedelta(days=p['days_start']),
                    end_date=date.today() + timedelta(days=p['days_end']),
                    budget=p['budget']
                )
                self.stdout.write(self.style.SUCCESS(f"Project created: {p['name']} for {p['client'].name}"))
            else:
                self.stdout.write(f"Project {p['name']} already exists.")

        # 4. Create Activity & Notifications
        if consultant:
            AuditLog.objects.create(
                user=consultant,
                action="SYSTEM_INIT",
                description="Consulting framework database seeding sequence successfully completed.",
                ip_address="127.0.0.1"
            )
            Notification.objects.create(
                user=consultant,
                title="Welcome to AIMCF Portal",
                message="Hi Sarah, your consulting workspace is initialized. Standard mock clients Acme and Nexis have been successfully pre-loaded.",
                is_read=False
            )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully."))
