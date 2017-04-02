REGION   := us-east-1
PLATFORM := standupman


.PHONY : ami
ami    :
	ansible-playbook \
		bake-ami.yml \
		-i inventory/hosts \
		-l $(REGION)-$(PLATFORM) \
		--diff \
		-vv

.PHONY : asg
asg    :
	ansible-playbook \
		asg.yml \
		-i inventory/hosts \
		-l $(REGION)-$(PLATFORM) \
		--diff \
		-vv
